package com.omsk.kp.rest

import com.omsk.kp.domain.model.Supplier
import com.omsk.kp.domain.srevice.SupplierService
import com.omsk.kp.dto.ContactSaveDTO
import com.omsk.kp.service.save.SupplierSaveService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/supplier")
class SupplierController(
    private val service: SupplierService,
    private val saveService: SupplierSaveService
) {
    @GetMapping("/all")
    fun findAll() = service.findAllShort()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = service.findById(id)

    @PostMapping("/save")
    fun save(@RequestBody dto: ContactSaveDTO) = saveService.save(dto)

    @PostMapping("/update")
    fun update(@RequestBody supplier: Supplier) = service.save(supplier)

    @DeleteMapping("/{id}/delete")
    fun delete(@PathVariable id: Long) = service.delete(id)
}