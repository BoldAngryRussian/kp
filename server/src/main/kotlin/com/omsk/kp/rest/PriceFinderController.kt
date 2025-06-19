package com.omsk.kp.rest

import com.omsk.kp.domain.model.Product
import com.omsk.kp.domain.service.ProductService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1")
class PriceFinderController(
    private val productService: ProductService
) {
    @GetMapping("/products/list", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun findAll(): List<Product> = productService.findAll()
}