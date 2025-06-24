package com.omsk.kp.domain.service

import com.omsk.kp.domain.model.CommercialOfferDetailsDescription
import com.omsk.kp.domain.repo.CommercialOfferDetailsDescriptionRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommercialOfferDetailsDescriptionService(
    private val repo: CommercialOfferDetailsDescriptionRepository
) {
    @Transactional
    fun save(description: String, commercialOfferId: Long) =
        repo.save(CommercialOfferDetailsDescription(description, commercialOfferId))

    @Transactional
    fun deleteByOfferId(offerId: Long) = repo.deleteByOfferId(offerId)

    fun findByOfferId(offerId: Long) = repo.findFirstByCommercialOfferId(offerId)
}