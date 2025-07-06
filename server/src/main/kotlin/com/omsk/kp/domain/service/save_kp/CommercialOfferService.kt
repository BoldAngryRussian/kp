package com.omsk.kp.domain.service.save_kp

import com.omsk.kp.domain.model.CommercialOffer
import com.omsk.kp.domain.repo.CommercialOfferRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.jvm.optionals.getOrNull

@Service
class CommercialOfferService(
    private val repo: CommercialOfferRepository
) {
    @Transactional
    fun save(commercialOffer: CommercialOffer) = repo.save(commercialOffer)

    @Transactional
    fun delete(entity: CommercialOffer) = repo.delete(entity)

    fun findById(id: Long) = repo.findById(id).getOrNull()

    fun findAllShort() = repo.findAllShort()
}