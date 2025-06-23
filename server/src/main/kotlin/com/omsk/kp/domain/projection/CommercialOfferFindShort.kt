package com.omsk.kp.domain.projection

interface CommercialOfferFindShort {
    val id: Long
    val managerId: Long
    val customerId: Long
    val date: String
    val type: String
    val company: String
    val phone: String
    val managerFirstName: String
    val managerSecondName: String
    val managerThirdName: String
    val weight: Double?
    val pricePurchase: Double?
    val priceTransport: Double?
    val priceSell: Double?
    val marga: Double?
}