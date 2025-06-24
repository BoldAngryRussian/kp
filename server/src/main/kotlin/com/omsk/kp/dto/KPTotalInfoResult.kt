package com.omsk.kp.dto

import com.omsk.kp.domain.model.CommercialOfferDetails
import com.omsk.kp.domain.model.Customer
import com.omsk.kp.domain.model.User
import com.omsk.kp.domain.model.getMarga
import com.omsk.kp.domain.model.getMarkupTotal
import com.omsk.kp.domain.model.getPurchasePriceTotal
import com.omsk.kp.domain.model.getSellPriceTotal
import com.omsk.kp.domain.model.getTotalWeight
import com.omsk.kp.domain.model.getTransportTotal
import com.omsk.kp.domain.projection.CommercialOfferHistoryFull

data class KPTotalInfoResult(
    val customerName: String,
    val created: String,
    val customer: KPTotalInfoCustomer,
    val manager: KPTotalInfoManager,
    val finance: KPInfoTotal,
    val products: List<KPTotalInfoProduct>,
    val history: List<CommercialOfferHistoryFull>
)

data class KPTotalInfoCustomer(
    val name: String,
    val address: String? = null,
    val phone: String,
    val email: String? = null
) {
    constructor(customer: Customer): this(
        name = "${customer.firstName} ${customer.secondName} ${customer.thirdName}",
        address = customer.address,
        phone = customer.phone,
        email = customer.email
    )
}

data class KPTotalInfoManager(
    val name: String,
    val phone: String,
    val email: String
) {
    constructor(manager: User): this(
        name = "${manager.firstName} ${manager.secondName} ${manager.thirdName}",
        phone = manager.phone,
        email = manager.email
    )
}

data class KPTotalInfoProduct (
    val name: String,
    val purchasePrice: Int,
    val markupPrice: Double,
    val transportPrice: Double,
    val sellPrice: Double,
    val quantity: Int,
    val weight: Double,
    val marga: Double
) {
    constructor(commercialOfferDetails: CommercialOfferDetails): this(
        name = commercialOfferDetails.name,
        purchasePrice = commercialOfferDetails.getPurchasePriceTotal(),
        markupPrice = commercialOfferDetails.getMarkupTotal(),
        transportPrice = commercialOfferDetails.getTransportTotal(),
        sellPrice = commercialOfferDetails.getSellPriceTotal(),
        quantity = commercialOfferDetails.quantity,
        weight = commercialOfferDetails.getTotalWeight(),
        marga = commercialOfferDetails.getMarga(),
    )
}