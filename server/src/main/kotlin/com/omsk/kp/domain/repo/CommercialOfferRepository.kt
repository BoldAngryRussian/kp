package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.CommercialOffer
import org.springframework.data.jpa.repository.JpaRepository

interface CommercialOfferRepository: JpaRepository<CommercialOffer, Long> {
}