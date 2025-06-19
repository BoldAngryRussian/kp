package com.omsk.kp.domain.service.save

import com.omsk.kp.converter.ProductDtoToProductConverter
import com.omsk.kp.domain.model.PriceList
import com.omsk.kp.domain.service.ProductService
import com.omsk.kp.dto.SavePriceDTO

interface SavePriceListSavingStrategy {

    val converter: ProductDtoToProductConverter
    val productService: ProductService

    fun isMy(priceList: PriceList?): Boolean
    fun save(priceList: PriceList? = null, dto: SavePriceDTO): PriceList

    fun saveProducts(dto: SavePriceDTO, priceListId: Long, priceListVersion: Int){
        dto
            .products
            .map { converter.convert(it, priceListId, priceListVersion) }
            .let( productService::saveAll )
    }
}