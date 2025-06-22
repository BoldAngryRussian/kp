package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.CommercialOfferDetailsDescription
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface CommercialOfferDetailsDescriptionRepository: JpaRepository<CommercialOfferDetailsDescription, Long> {
    @Modifying
    @Query(
        value = "delete from commercial_offer_details_description where commercial_offer_id = :offerId",
        nativeQuery = true
    )
    fun deleteByOfferId(offerId: Long)
}