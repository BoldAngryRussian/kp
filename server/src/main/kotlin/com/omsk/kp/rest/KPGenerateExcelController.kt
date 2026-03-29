package com.omsk.kp.rest

import com.omsk.kp.domain.service.GenerateExcelService
import com.omsk.kp.dto.ExcelUnloadingDTO
import com.omsk.kp.utils.KPLog
import com.omsk.kp.utils.REST_V1
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

@RestController
@RequestMapping("${REST_V1}/export")
class KPGenerateExcelController(
    private val generateExcelService: GenerateExcelService
) {
    @PostMapping("/{id}/excel")
    fun exportProducts(
        @PathVariable id: Long,
        @RequestBody dto: ExcelUnloadingDTO
    ): ResponseEntity<ByteArray> {
        val outStream = generateExcelService.generate(id, dto.withSupplier)
        KPLog.info("exportProducts id=${dto.id} isWithSupplier=${dto.withSupplier}")

        val headers = HttpHeaders().apply {
            contentType = MediaType.APPLICATION_OCTET_STREAM
            add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.xlsx")
        }

        return ResponseEntity
            .ok()
            .headers(headers)
            .body(outStream)
    }
}