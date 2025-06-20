package com.omsk.kp.domain.service.save_price_list.impl

import com.omsk.kp.converter.ProductDtoToProductConverter
import com.omsk.kp.domain.model.PriceList
import com.omsk.kp.domain.service.PriceListService
import com.omsk.kp.domain.service.ProductService
import com.omsk.kp.domain.service.save_price_list.SavePriceListSavingStrategy
import com.omsk.kp.dto.SavePriceDTO
import org.springframework.stereotype.Component

@Component
class SavePriceListSavingNoSupplier(
    override val productService: ProductService,
    private val priceListService: PriceListService,
): SavePriceListSavingStrategy {

    override val converter = ProductDtoToProductConverter()

    override fun isMy(priceList: PriceList?) = priceList == null

    override fun save(priceList: PriceList?, dto: SavePriceDTO): PriceList {
        val newPriceList = priceListService
            .save(PriceList(suppliersId = dto.supplierId))
        saveProducts(dto, newPriceList.id!!, newPriceList.version)

        return newPriceList
    }
}