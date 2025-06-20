package com.omsk.kp.domain.service.save_price_list.impl

import com.omsk.kp.converter.ProductDtoToProductConverter
import com.omsk.kp.domain.model.PriceList
import com.omsk.kp.domain.service.ProductService
import com.omsk.kp.domain.service.save_price_list.SavePriceListSavingStrategy
import com.omsk.kp.dto.SavePriceDTO
import org.springframework.stereotype.Component


@Component
class SavePriceListSavingSupplierExists(
    override val productService: ProductService,
): SavePriceListSavingStrategy {

    override val converter = ProductDtoToProductConverter()

    override fun isMy(priceList: PriceList?) = priceList != null

    override fun save(priceList: PriceList?, dto: SavePriceDTO): PriceList {
        val version = priceList!!.version + 1
        priceList.version = version
        saveProducts(dto, priceList.id!!, version)

        return priceList
    }
}