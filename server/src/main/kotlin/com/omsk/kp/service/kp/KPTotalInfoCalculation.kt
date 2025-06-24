package com.omsk.kp.service.kp

import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.model.getMarga
import com.omsk.kp.domain.model.getPurchasePriceTotal
import com.omsk.kp.domain.model.getSellPriceTotal
import com.omsk.kp.domain.model.getTotalWeight
import com.omsk.kp.domain.model.getTransportTotal
import com.omsk.kp.dto.KPInfoTotal

class KPTotalInfoCalculation {
    fun calculate(products: List<CommercialOfferDetails>): KPInfoTotal {
        val total = KPInfoTotal()
        products
            .map {
                total.weight += it.getTotalWeight()
                total.pricePurchase += it.getPurchasePriceTotal()
                total.priceTransport += it.getTransportTotal()
                total.priceSell += it.getSellPriceTotal()
                total.marga += it.getMarga()
            }
        return total
    }
}