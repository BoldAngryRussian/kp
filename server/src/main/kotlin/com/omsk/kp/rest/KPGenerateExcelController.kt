package com.omsk.kp.rest

import com.omsk.kp.domain.service.GenerateExcelService
import com.omsk.kp.utils.REST_V1
import jakarta.servlet.http.HttpServletResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("${REST_V1}/export")
class KPGenerateExcelController(
    private val generateExcelService: GenerateExcelService
) {
    @GetMapping("/excel")
    fun exportProducts(response: HttpServletResponse): ResponseEntity<ByteArray> {
        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_OCTET_STREAM
            add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx")
        }

        val outStream =generateExcelService.generate()

        return ResponseEntity
            .ok()
            .headers(headers)
            .body(outStream)
    }
}