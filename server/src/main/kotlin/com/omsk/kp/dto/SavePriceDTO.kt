package com.omsk.kp.dto

data class SavePriceDTO(
    val supplierId: Long,
    val products: List<ProductDTO>
)

data class SavePriceResponseDTO(
    val result: Boolean,
    val error: String? = null
)