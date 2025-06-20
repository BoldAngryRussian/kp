package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.CommercialOfferDetailsDescription
import org.springframework.data.jpa.repository.JpaRepository

interface CommercialOfferDetailsDescriptionRepository: JpaRepository<CommercialOfferDetailsDescription, Long> {
}