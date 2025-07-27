package com.omsk.kp.dto

import com.omsk.kp.domain.model.CommercialOffer
import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.model.CommercialOfferTotal
import com.omsk.kp.domain.model.Customer
import com.omsk.kp.domain.model.User

data class KPOfferComplexInfo(
    val offer: CommercialOffer,
    val customer: Customer,
    val manager: User,
    val products: List<CommercialOfferDetails>,
    val total: CommercialOfferTotal? = null,
    val additionalServices: List<AdditionalServicesDTO>
)
