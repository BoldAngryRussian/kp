package com.omsk.kp.service.update

import com.omsk.kp.converter.ContactSaveDtoToCustomer
import com.omsk.kp.domain.srevice.CustomerService
import com.omsk.kp.dto.ContactSaveDTO
import org.springframework.stereotype.Service

@Service
class CustomerUpdateService(
    private val customerService: CustomerService
) {

    private val converter = ContactSaveDtoToCustomer()

    fun update(dto: ContactSaveDTO) =
        converter
            .convert(dto)
            .copy(id = dto.id)
            .let(customerService::save)

}