package com.omsk.kp.domain.service.save_price_list

import com.omsk.kp.domain.service.PriceListService
import com.omsk.kp.domain.service.save_price_list.listener.SavePriceServiceListener
import com.omsk.kp.dto.SavePriceDTO
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SavePriceService(
    private val priceListService: PriceListService,
    private val handlers: List<SavePriceListSavingStrategy>,
    private val listeners: List<SavePriceServiceListener>
) {
    @Transactional
    fun save(dto: SavePriceDTO) {
        val priceList = priceListService
            .findBySupplierIdLocking(dto.supplierId)

        handlers
            .find { it.isMy(priceList) }!!
            .save(priceList, dto)
            .also { o -> listeners.forEach { it.listen(o) } }
    }
}