package com.omsk.kp.domain.service

import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.model.getDescOrEmpty
import com.omsk.kp.domain.model.getSellPrice
import com.omsk.kp.domain.service.save_kp.CommercialOfferDetailsService
import com.omsk.kp.domain.service.save_kp.CommercialOfferService
import org.springframework.stereotype.Service
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import org.springframework.core.io.ClassPathResource
import java.io.ByteArrayOutputStream
import org.apache.poi.ss.usermodel.*


@Service
class GenerateExcelService(
    private val commercialOfferDetailsService: CommercialOfferDetailsService,
    private val commercialOfferDetailsDescriptionService: CommercialOfferDetailsDescriptionService
) {
    fun generate(offerId: Long): ByteArray {
        val products = commercialOfferDetailsService
            .findAllByOfferId(offerId)

        val desc = commercialOfferDetailsDescriptionService
            .findByOfferId(offerId)

        if (products.isEmpty())
        throw RuntimeException("Не найдено информации по КП №${offerId}")

        val templateInputStream = ClassPathResource("excel/template.xlsx").inputStream
        val workbook = XSSFWorkbook(templateInputStream)

        mapOf(
            "DATE" to LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
            "TERMS" to desc.getDescOrEmpty(),
            "SUMMA" to "1,000,000 Руб"
        ).forEach { findAndReplace(it.key, it.value, workbook) }

        copy(workbook, products)

        // Сохранить в память
        val outStream = ByteArrayOutputStream()
        workbook.write(outStream)
        workbook.close()

        return outStream.toByteArray()
    }

    private fun findAndReplace(what: String, to: String, workbook: XSSFWorkbook){
        // Перебор всех листов, строк и ячеек
        for (sheetIndex in 0 until workbook.numberOfSheets) {
            val sheet = workbook.getSheetAt(sheetIndex)
            for (row in sheet) {
                for (cell in row) {
                    if (cell.toString().contains("\$${what}\$")) {
                        cell.setCellValue(cell.stringCellValue.replace("\$${what}\$", to))
                    }
                }
            }
        }
    }

    private fun copy(workbook: XSSFWorkbook, products: List<CommercialOfferDetails>) {
        val sheet: Sheet = workbook.getSheetAt(0)
        val templateRowIndex = 9 // строка №10
        val templateRow = sheet.getRow(templateRowIndex)

        var i = 0
        val dataList = mutableListOf<List<String>>()
        products
            .map {
                dataList.add(
                    listOf(
                        (++i).toString(),
                        it.name,
                        "кг",
                        it.quantity.toString(),
                        it.getSellPrice().toString(),
                        (it.quantity * it.getSellPrice()).toString()
                    )
                )
            }
        /*
        val dataList = listOf(
            listOf("1", "Тушка", "кг", "500", "121", "10000"),
            listOf("2", "Тушка", "кг", "500", "121", "10000"),
            listOf("3", "Пушка", "кг", "600", "121", "10000"),
            listOf("4", "Кальмар", "кг", "700", "122", "10000"),
            listOf("5", "Осетр", "кг", "800", "123", "10000"),
            listOf("6", "Тушка", "кг", "500", "121", "10000"),
            listOf("7", "Пушка", "кг", "600", "121", "10000"),
            listOf("8", "Кальмар", "кг", "700", "122", "10000"),
            listOf("9", "Осетр", "кг", "800", "123", "10000"),
            listOf("10", "Тушка", "кг", "500", "121", "10000"),
            listOf("11", "Пушка", "кг", "600", "121", "10000"),
            listOf("12", "Кальмар", "кг", "700", "122", "10000"),
            listOf("13", "Осетр", "кг", "800", "123", "10000"),
            listOf("14", "Тушка", "кг", "500", "121", "10000"),
            listOf("15", "Пушка", "кг", "600", "121", "10000"),
            listOf("16", "Кальмар", "кг", "700", "122", "10000"),
            listOf("17", "Осетр", "кг", "800", "123", "10000"),
        )

         */

        // 1. Сдвигаем строки ВНИЗ
        sheet.shiftRows(templateRowIndex + 1, sheet.lastRowNum, dataList.size)

        // 2. Вставляем строки
        var currentRowIndex = templateRowIndex + 1
        for (rowData in dataList) {
            val newRow = sheet.createRow(currentRowIndex++)

            for (col in rowData.indices) {
                val templateCell = templateRow.getCell(col)
                val newCell = newRow.createCell(col)

                if (templateCell != null) {
                    newCell.cellStyle = templateCell.cellStyle
                    when (templateCell.cellType) {
                        CellType.FORMULA -> {
                            val formula = templateCell.cellFormula
                            newCell.setCellFormula(formula)
                        }
                        else -> {
                            newCell.cellType = templateCell.cellType
                        }
                    }
                }

                if (col < rowData.size) {
                    newCell.setCellValue(rowData[col])
                }
            }
        }


        // 💡 Сдвигаем всё, начиная со строки ВЫШЕ шаблона (его индекс)
        sheet.shiftRows(10, sheet.lastRowNum, -1)
        //sheet.shiftRows(templateRowIndex + dataList.size + 1, sheet.lastRowNum, -2)
        // Удаляем шаблон после сдвига
        //sheet.removeRow(sheet.getRow(templateRowIndex))
    }

    /*
    private fun copy(workbook: XSSFWorkbook){
        val sheet: Sheet = workbook.getSheetAt(0)
        val templateRowIndex = 9 // например, эталонная строка на 10-й (индекс 9)
        val templateRow = sheet.getRow(templateRowIndex)

        val dataList = listOf(
            listOf("2", "Тушка", "кг", "500", "121", "10000"),
            listOf("3", "Пушка", "кг", "600", "121", "10000"),
            listOf("4", "Кальмар", "кг", "700", "122", "10000"),
            listOf("5", "Осетр", "кг", "800", "123", "10000"),
            listOf("6", "Тушка", "кг", "500", "121", "10000"),
            listOf("7", "Пушка", "кг", "600", "121", "10000"),
            listOf("8", "Кальмар", "кг", "700", "122", "10000"),
            listOf("9", "Осетр", "кг", "800", "123", "10000"),
            listOf("10", "Тушка", "кг", "500", "121", "10000"),
            listOf("11", "Пушка", "кг", "600", "121", "10000"),
            listOf("12", "Кальмар", "кг", "700", "122", "10000"),
            listOf("13", "Осетр", "кг", "800", "123", "10000"),
            listOf("14", "Тушка", "кг", "500", "121", "10000"),
            listOf("15", "Пушка", "кг", "600", "121", "10000"),
            listOf("16", "Кальмар", "кг", "700", "122", "10000"),
            listOf("17", "Осетр", "кг", "800", "123", "10000"),
        )

        // 💡 Сдвигаем строки вниз
        sheet.shiftRows(templateRowIndex + 1, sheet.lastRowNum, dataList.size)

        var currentRowIndex = templateRowIndex + 1
        for (rowData in dataList) {
            val newRow = sheet.createRow(currentRowIndex++)

            for (col in rowData.indices) {
                val templateCell = templateRow.getCell(col)
                val newCell = newRow.createCell(col)

                if (templateCell != null) {
                    newCell.cellStyle = templateCell.cellStyle
                    when (templateCell.cellType) {
                        CellType.FORMULA -> {
                            val formula = templateCell.cellFormula
                            if (formula != null) {
                                newCell.setCellFormula(formula)
                            }
                        }
                        else -> {
                            newCell.cellType = templateCell.cellType
                        }
                    }
                }

                if (col < rowData.size) {
                    newCell.setCellValue(rowData[col])
                }
            }
        }

        // 🔁 Удаляем эталонную строку после вставки
        sheet.removeRow(templateRow)
        sheet.shiftRows(currentRowIndex, sheet.lastRowNum + 1, -1)
    }
     */
}