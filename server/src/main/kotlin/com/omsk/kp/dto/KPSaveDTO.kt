package com.omsk.kp.dto

data class KPSaveDTO(
    val customerId: Long,
    val managerId: Long,
    val terms: String? = null,
    val elems: List<KPSaveElemDTO>
)

data class KPSaveElemDTO (
    val name: String,
    val price: Int,
    val markupExtra: Int? = null,
    val markupPercent: Int? = null,
    val transportExtra: Int? = null,
    val transportPercent: Int? = null,
    val quantity: Int,
    val weightKg: Int,
)
