package com.omsk.kp.domain.srevice

import com.omsk.kp.domain.model.PriceList
import com.omsk.kp.domain.repo.PriceListRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PriceListService(
    private val repo: PriceListRepository
) {
    @Transactional
    fun save(priceList: PriceList) = repo.save(priceList)

    fun findBySupplierId(supplierId: Long) = repo.findBySuppliersId(supplierId)

    @Transactional
    fun findBySupplierIdLocking(supplierId: Long) = repo.findWithLocking(supplierId)
}