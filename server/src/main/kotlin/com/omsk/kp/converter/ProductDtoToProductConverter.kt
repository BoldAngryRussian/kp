package com.omsk.kp.converter

import com.omsk.kp.domain.model.Product
import com.omsk.kp.dto.ProductDTO

class ProductDtoToProductConverter {

    fun convert(dto: ProductDTO, priceListId: Long, priceListVersion: Int) =
        Product(
            name = dto.name,
            price = dto.price,
            priceListId = priceListId,
            priceListVersion = priceListVersion,
            measurement = dto.measurement
        )

}