package com.omsk.kp.domain.service.save.listener

import com.omsk.kp.domain.model.PriceList

interface SavePriceServiceListener {
    fun listen(priceList: PriceList)
}