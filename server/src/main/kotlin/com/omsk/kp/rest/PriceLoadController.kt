package com.omsk.kp.rest

import com.omsk.kp.domain.service.RecognizePriceListService
import com.omsk.kp.utils.REST_V1
import com.omsk.kp.domain.service.save_price_list.SavePriceService
import com.omsk.kp.dto.ProductDTO
import com.omsk.kp.dto.SavePriceDTO
import com.omsk.kp.utils.KPLog
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("${REST_V1}/prices")
class PriceLoadController(
    private val savePriceService: SavePriceService
) {
    private val recognizePriceListService = RecognizePriceListService()

    @PostMapping("/recognize", consumes = [MediaType.MULTIPART_FORM_DATA_VALUE])
    fun recognize(@RequestParam("file") file: MultipartFile): List<ProductDTO> {
        return recognizePriceListService.recognize(file)
    }

    @PostMapping("/save")
    fun save(@RequestBody dto: SavePriceDTO): ResponseEntity<Void> {
        savePriceService.save(dto)
        return ResponseEntity.ok().build()
    }
}