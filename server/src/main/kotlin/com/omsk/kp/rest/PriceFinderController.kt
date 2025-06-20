package com.omsk.kp.rest

import com.omsk.kp.domain.projection.ProductShort
import com.omsk.kp.domain.service.ProductService
import com.omsk.kp.utils.REST_V1
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(REST_V1)
class PriceFinderController(
    private val productService: ProductService
) {
    @GetMapping("/products/all/short", produces = [MediaType.APPLICATION_JSON_VALUE])
    fun findAll(): List<ProductShort> = productService.findAllShort()
}