package com.omsk.kp.domain.service

import com.omsk.kp.domain.model.CommercialOfferTotal
import com.omsk.kp.domain.repo.CommercialOfferTotalRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommercialOfferTotalService(
    private val repo: CommercialOfferTotalRepository
) {
    @Transactional
    fun save(commercialOfferTotal: CommercialOfferTotal) = repo.save(commercialOfferTotal)

    fun findByOfferId(offerId: Long) = repo.findFirstByCommercialOfferId(offerId)

    @Transactional
    fun deleteByOfferId(offerId: Long) = repo.deleteByOfferId(offerId)
}