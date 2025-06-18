package com.omsk.kp.rest

import com.omsk.kp.domain.srevice.ProductService
import com.omsk.kp.domain.srevice.SavePriceService
import com.omsk.kp.dto.ProductDTO
import com.omsk.kp.dto.SavePriceDTO
import com.omsk.kp.utils.KPLog
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/v1/prices")
class PriceLoadController(
    private val productService: ProductService,
    private val savePriceService: SavePriceService
) {

    @PostMapping("/recognize", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun recognize(@RequestParam("file") file: MultipartFile): List<ProductDTO> {
        val workbook = XSSFWorkbook(file.inputStream)
        val sheet = workbook.getSheetAt(0)

        val products = mutableListOf<ProductDTO>()
        for (row in sheet){
            try {
                val name = row.getCell(0).stringCellValue.trim()
                val price = (row.getCell(1).numericCellValue * 100).toLong()

                KPLog.info("name$name price=$price")
                products += ProductDTO(name, price, name.contains("!").not())
            } catch (e: Exception){
                KPLog.info("Error while loading -> ${e.message}")
            }
        }

        KPLog.info("Save to PRODUCT table count=${products.count()}")
        return products
    }

    @PostMapping("/upload")
    fun upload(@RequestBody dto: SavePriceDTO) = savePriceService.save(dto)
}