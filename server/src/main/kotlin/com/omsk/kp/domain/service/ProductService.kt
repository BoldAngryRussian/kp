package com.omsk.kp.domain.service

import com.omsk.kp.domain.model.Product
import com.omsk.kp.domain.repo.ProductRepository
import org.springframework.transaction.annotation.Transactional
import org.springframework.stereotype.Service

@Service
class ProductService(
    private val productRepository: ProductRepository
) {

    fun findAllShort() = productRepository.findAllShort()

    @Transactional
    fun saveAll(elems: List<Product>) = productRepository
        .saveAll(elems)

    @Transactional
    fun clear(priceListId: Long, version: Int) = productRepository
        .clear(priceListId, version)
}