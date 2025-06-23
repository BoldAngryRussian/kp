package com.omsk.kp.domain.service

import com.omsk.kp.domain.model.CommercialOfferHistory
import com.omsk.kp.domain.model.CommercialOfferHistoryType
import com.omsk.kp.domain.repo.CommercialOfferHistoryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CommercialOfferHistoryService(
    private val repo: CommercialOfferHistoryRepository
) {
    @Transactional
    fun save(offerId: Long, userId: Long, action: CommercialOfferHistoryType) =
        repo.save(
            CommercialOfferHistory(
                commercialOfferId = offerId,
                userId = userId,
                userAction = action
            )
        )

    fun getHistory(offerId: Long) = repo.findAllByCommercialOfferIdOrdered(offerId)
}