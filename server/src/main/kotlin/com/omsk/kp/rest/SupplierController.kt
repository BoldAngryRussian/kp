package com.omsk.kp.rest

import com.omsk.kp.domain.srevice.SupplierService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/supplier")
class SupplierController(
    private val service: SupplierService
) {
    @GetMapping("/all")
    fun findAll() = service.findAllShort()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = service.findById(id)
}