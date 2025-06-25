package com.omsk.kp.dto

data class KPSaveDTO(
    val customerId: Long,
    val managerId: Long,
    val offerId: Long? = null,
    val terms: String? = null,
    val elems: List<KPSaveElemDTO>
)

data class KPSaveElemDTO (
    val name: String,
    val price: Int,
    val markupExtra: Double? = null,
    val markupPercent: Double? = null,
    val transportExtra: Double? = null,
    val transportPercent: Double? = null,
    val quantity: Int,
    val weightKg: Double
)

data class KPUpdateStatusDTO(
    val offerId: Long,
    val managerId: Long,
    val new: String
)
