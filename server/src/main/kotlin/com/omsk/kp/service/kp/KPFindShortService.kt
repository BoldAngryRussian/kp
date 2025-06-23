package com.omsk.kp.service.kp

import com.omsk.kp.domain.service.save_kp.CommercialOfferService
import org.springframework.stereotype.Service

@Service
class KPFindShortService(
    private val commercialOfferService: CommercialOfferService
) {
    fun findAll() = commercialOfferService
        .findAllShort()
}