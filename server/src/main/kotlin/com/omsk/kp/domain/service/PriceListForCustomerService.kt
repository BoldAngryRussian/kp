package com.omsk.kp.domain.service

import com.omsk.kp.domain.repo.PriceListRepository
import org.springframework.stereotype.Service

@Service
class PriceListForCustomerService(
    private val priceListRepository: PriceListRepository
) {
    fun find(multiPlicator: Int) = priceListRepository
        .findPriceListForDownload(multiPlicator)
}