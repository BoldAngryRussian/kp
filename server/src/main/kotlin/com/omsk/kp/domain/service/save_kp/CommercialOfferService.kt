package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.domain.model.CommercialOffer
import com.omsk.kp.domain.repo.CommercialOfferRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommercialOfferService(
    private val repo: CommercialOfferRepository
) {
    @Transactional
    fun save(commercialOffer: CommercialOffer) = repo.save(commercialOffer)
}