package com.omsk.kp.service.save

import com.omsk.kp.converter.ContactSaveDtoToCustomer
import com.omsk.kp.domain.service.CustomerService
import com.omsk.kp.dto.ContactSaveDTO
import org.springframework.stereotype.Service

@Service
class CustomerSaveService(
    private val customerService: CustomerService
) {
    private val converter = ContactSaveDtoToCustomer()

    fun save(dto: ContactSaveDTO) =
        converter
            .convert(dto)
            .let(customerService::save)

}