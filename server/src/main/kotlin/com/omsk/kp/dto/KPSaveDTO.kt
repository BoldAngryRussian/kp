package com.omsk.kp.dto

import com.fasterxml.jackson.annotation.JsonFormat
import java.util.Date

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
    val weightKg: Double,
    val supplier: String? = null,
    val temperatureMode: String? = null,
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    val priceListDate: Date? = null,
    val measurement: String
)

data class KPUpdateStatusDTO(
    val offerId: Long,
    val managerId: Long,
    val new: String
)

data class KPDeleteDTO(
    val offerId: Long
)
