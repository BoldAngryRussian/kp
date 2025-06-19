package com.omsk.kp.domain.service.save.listener.impl

import com.omsk.kp.domain.model.PriceList
import com.omsk.kp.domain.service.ProductService
import com.omsk.kp.domain.service.save.listener.SavePriceServiceListener
import org.springframework.stereotype.Component

@Component
class SavePriceServiceDeleteOldProductsListener(
    private val productService: ProductService,
): SavePriceServiceListener {
    override fun listen(priceList: PriceList) {
        productService.clear(priceList.id!!, priceList.version)
    }
}