package com.omsk.kp.domain.service.save_kp.converter

import com.omsk.kp.domain.model.CommercialOffer
import com.omsk.kp.dto.KPSaveDTO

class KPSaveDtoToCommercialOffer {
    fun convert(dto: KPSaveDTO) =
        CommercialOffer(
            dto.managerId,
            dto.customerId
        )
}