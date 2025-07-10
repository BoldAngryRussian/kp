package com.omsk.kp.domain.service

import com.omsk.kp.dto.ProductDTO
import com.omsk.kp.utils.KPLog
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.web.multipart.MultipartFile

class RecognizePriceListService {

    fun recognize(file: MultipartFile): List<ProductDTO> {
        val workbook = XSSFWorkbook(file.inputStream)
        val sheet = workbook.getSheetAt(0)

        val products = mutableListOf<ProductDTO>()
        for (row in sheet){
            try {
                val name = row.getCell(0).stringCellValue.trim()
                val measurement = row.getCell(1).stringCellValue.trim()
                val price = (row.getCell(2).numericCellValue * 100).toLong()
                KPLog.info("name$name price=$price measurement=$measurement")
                products += ProductDTO(name, price, measurement,name.contains("!").not())
            } catch (e: Exception){
                KPLog.info("Error while loading -> ${e.message}")
                //throw RuntimeException("Прайс-лист не корректен! Счертесь с инструкцией загрузки!")
            }
        }

        KPLog.info("Save to PRODUCT table count=${products.count()}")
        return products
    }
}