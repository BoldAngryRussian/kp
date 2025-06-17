package com.omsk.kp.converter

import com.omsk.kp.dto.ContactSaveDTO
import com.omsk.kp.domain.model.Supplier

class ContactSaveDtoToSupplier {
    fun convert(dto: ContactSaveDTO): Supplier =
        Supplier(
            company = dto.company,
            firstName = dto.firstName,
            secondName = dto.secondName,
            thirdName = dto.thirdName,
            phone = dto.phone,
            email = dto.email,
            address = dto.address,
            details = dto.details
        )
}
