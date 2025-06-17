package com.omsk.kp.service.update

import com.omsk.kp.converter.ContactSaveDtoToSupplier
import com.omsk.kp.domain.srevice.SupplierService
import com.omsk.kp.dto.ContactSaveDTO
import org.springframework.stereotype.Service

@Service
class SupplierUpdateService(
    private val supplierService: SupplierService
) {
    private val convert = ContactSaveDtoToSupplier()

    fun update(dto: ContactSaveDTO) =
        convert
            .convert(dto)
            .copy(id = dto.id)
            .let(supplierService::save)
}