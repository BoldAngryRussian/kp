package com.omsk.kp.dto

import com.omsk.kp.domain.model.CommercialOffer
import com.omsk.kp.domain.model.User
import com.omsk.kp.utils.toDate

data class KPSaveResultDTO(
    val id: Long,
    val firstName: String,
    val secondName: String,
    val created: String
){
    constructor(offer: CommercialOffer, manager: User): this(
        offer.id!!,
        manager.firstName,
        manager.secondName,
        toDate(offer.createdAt)
    )
}
