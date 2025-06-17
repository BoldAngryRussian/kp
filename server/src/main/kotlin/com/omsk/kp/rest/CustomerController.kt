package com.omsk.kp.rest

import com.omsk.kp.domain.model.Customer
import com.omsk.kp.domain.srevice.CustomerService
import com.omsk.kp.dto.ContactSaveDTO
import com.omsk.kp.service.save.CustomerSaveService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/customer")
class CustomerController(
    private val service: CustomerService,
    private val saveService: CustomerSaveService
) {
    @GetMapping("/all")
    fun findAll() = service.findAllShort()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long) = service.findById(id)

    @PostMapping("/save")
    fun save(@RequestBody dto: ContactSaveDTO) = saveService.save(dto)

    @PostMapping("/update")
    fun update(@RequestBody customer: Customer) = service.save(customer)

    @DeleteMapping("/{id}/delete")
    fun delete(@PathVariable id: Long) = service.delete(id)
}