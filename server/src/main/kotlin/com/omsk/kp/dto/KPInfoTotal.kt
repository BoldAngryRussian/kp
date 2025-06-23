package com.omsk.kp.dto

import com.omsk.kp.domain.model.CommercialOfferTotal
import com.omsk.kp.domain.model.getMarga
import com.omsk.kp.domain.model.getPricePurchase
import com.omsk.kp.domain.model.getPriceSell
import com.omsk.kp.domain.model.getPriceTransport
import com.omsk.kp.domain.model.getWeight

data class KPInfoTotal(
    var weight: Double = 0.0,
    var pricePurchase: Double = 0.0,
    var priceTransport: Double = 0.0,
    var priceSell: Double = 0.0,
    var marga: Double = 0.0
) {
    constructor(commercialOfferTotal: CommercialOfferTotal?): this(
        weight = commercialOfferTotal.getWeight(),
        pricePurchase = commercialOfferTotal.getPricePurchase(),
        priceTransport = commercialOfferTotal.getPriceTransport(),
        priceSell = commercialOfferTotal.getPriceSell(),
        marga = commercialOfferTotal.getMarga()
    )
}
