package com.omsk.kp.service.save

import com.omsk.kp.converter.ContactSaveDtoToSupplier
import com.omsk.kp.domain.srevice.SupplierService
import com.omsk.kp.dto.ContactSaveDTO
import org.springframework.stereotype.Service

@Service
class SupplierSaveService(
    private val supplierService: SupplierService
) {
    private val converter = ContactSaveDtoToSupplier()

    fun save(dto: ContactSaveDTO) =
        converter
            .convert(dto)
            .let( supplierService::save )
}