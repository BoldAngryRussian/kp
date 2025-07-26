package com.omsk.kp.rest

import com.omsk.kp.domain.service.GeneratePriceListForCustomersExcelService
import com.omsk.kp.dto.CustomerExportPriceDTO
import com.omsk.kp.utils.REST_V1
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${REST_V1}/price-list/customer")
class PriceListGenerateCustomerExcelExportController(
    private val service: GeneratePriceListForCustomersExcelService
) {
    @PostMapping("/export/excel")
    fun export(@RequestBody dto: CustomerExportPriceDTO): ResponseEntity<ByteArray> {
        val outStream = service.generate(dto.multy)

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_OCTET_STREAM
            add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=price.xlsx")
        }

        return ResponseEntity
            .ok()
            .headers(headers)
            .body(outStream)
    }
}