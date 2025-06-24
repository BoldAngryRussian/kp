package com.omsk.kp.domain.service

import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.model.getDescOrEmpty
import com.omsk.kp.domain.model.getSellPriceTotal
import com.omsk.kp.domain.model.getSellPriceByQuantity
import com.omsk.kp.domain.service.save_kp.CommercialOfferDetailsService
import com.omsk.kp.utils.formatToAmount
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

        var allSellPricesTotal = 0.0
        products.forEach { allSellPricesTotal += it.getSellPriceByQuantity() }
        mapOf(
            "DATE" to LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")),
            "TERMS" to desc.getDescOrEmpty(),
            "SUMMA" to formatToAmount(allSellPricesTotal)
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
                        formatToAmount(it.getSellPriceTotal()),
                        formatToAmount(it.getSellPriceByQuantity())
                    )
                )
            }

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
        sheet.shiftRows(templateRowIndex + 1, sheet.lastRowNum, -1)
    }
}