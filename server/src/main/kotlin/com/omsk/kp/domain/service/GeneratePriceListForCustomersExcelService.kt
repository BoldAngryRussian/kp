package com.omsk.kp.domain.service

import com.omsk.kp.utils.formatToAmount
import org.apache.poi.ss.usermodel.CellType
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Service
import java.io.ByteArrayOutputStream

@Service
class GeneratePriceListForCustomersExcelService(
    private val priceListForCustomerService: PriceListForCustomerService
) {
    fun generate(multiplicator: Int): ByteArray {

        val products = priceListForCustomerService.find(multiplicator)
        val templateInputStream = ClassPathResource("excel/template-price.xlsx").inputStream
        val workbook = XSSFWorkbook(templateInputStream)

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
                        it.measurement,
                        formatToAmount(it.price),
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
                    if (templateCell.cellType == CellType.FORMULA) {
                        newCell.cellFormula = templateCell.cellFormula
                    }
                }

                if (col < rowData.size) {
                    newCell.setCellValue(rowData[col])
                }
            }
        }
        // 💡 Сдвигаем всё, начиная со строки ВЫШЕ шаблона (его индекс)
        sheet.shiftRows(templateRowIndex + 1, sheet.lastRowNum, -1)

        // Сохранить в память
        val outStream = ByteArrayOutputStream()
        workbook.write(outStream)
        workbook.close()

        return outStream.toByteArray()
    }
}