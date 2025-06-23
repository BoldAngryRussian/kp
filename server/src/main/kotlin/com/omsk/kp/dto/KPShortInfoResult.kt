package com.omsk.kp.dto

data class KPShortInfoResult(
    val elems: List<KPShortInfo>
)

data class KPShortInfo(
    val offerId: Long,
    val status: String? = null,
    val customer: String,
    val phone: String,
    val manager: String,
    val weight: Double,
    val purchase: Double,
    val created: String
)
