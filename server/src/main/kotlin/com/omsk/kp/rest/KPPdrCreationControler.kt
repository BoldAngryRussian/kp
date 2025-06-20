package com.omsk.kp.rest

import com.omsk.kp.service.pdf.PDFGenerator
import com.omsk.kp.utils.REST_V1
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(REST_V1)
class KPPdrCreationControler(
    private val pdfGenerator: PDFGenerator
) {
    @GetMapping("/pdf")
    fun generate(): ResponseEntity<ByteArray> {
        val pdfBytes = pdfGenerator.generate()
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=document.pdf")
            .contentType(MediaType.APPLICATION_PDF)
            .contentLength(pdfBytes.size.toLong())
            .body(pdfBytes)
    }
}