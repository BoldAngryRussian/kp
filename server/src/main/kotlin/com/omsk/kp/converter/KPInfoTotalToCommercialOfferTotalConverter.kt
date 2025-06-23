package com.omsk.kp.converter

import com.omsk.kp.domain.model.CommercialOfferTotal
import com.omsk.kp.dto.KPInfoTotal

class KPInfoTotalToCommercialOfferTotalConverter {
    fun convert(total: KPInfoTotal, offerId: Long) =
        CommercialOfferTotal(
            commercialOfferId = offerId,
            weight = total.weight,
            pricePurchase = total.pricePurchase,
            priceTransport = total.priceTransport,
            priceSell = total.priceSell,
            marga = total.marga
        )
}