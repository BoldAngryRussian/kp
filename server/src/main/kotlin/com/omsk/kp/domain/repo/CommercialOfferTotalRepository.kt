package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.CommercialOfferTotal
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface CommercialOfferTotalRepository: JpaRepository<CommercialOfferTotal, Long> {

    @Modifying
    @Query(
        value = "delete from commercial_offer_total where commercial_offer_id = :offerId",
        nativeQuery = true
    )
    fun deleteByOfferId(offerId: Long)

    fun findFirstByCommercialOfferId(commercialOfferId: Long): CommercialOfferTotal?
}