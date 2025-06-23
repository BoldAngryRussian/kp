package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.CommercialOfferDetails
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface CommercialOfferDetailsRepository: JpaRepository<CommercialOfferDetails, Long> {
    @Modifying
    @Query(
        value = "delete from commercial_offer_details where commercial_offer_id = :offerId",
        nativeQuery = true
    )
    fun deleteByOfferId(offerId: Long)

    fun findAllByCommercialOfferId(offerId: Long): List<CommercialOfferDetails>
}