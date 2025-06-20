package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.repo.CommercialOfferDetailsRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommercialOfferDetailsService(
    private val repo: CommercialOfferDetailsRepository
) {
    @Transactional
    fun saveAll(commercialOfferDetails: List<CommercialOfferDetails>) = repo
        .saveAll(commercialOfferDetails)
}