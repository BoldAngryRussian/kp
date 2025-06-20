package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.CommercialOfferDetails
import org.springframework.data.jpa.repository.JpaRepository

interface CommercialOfferDetailsRepository: JpaRepository<CommercialOfferDetails, Long> {
}