package com.omsk.kp.domain.srevice

import com.omsk.kp.domain.model.Product
import com.omsk.kp.domain.repo.ProductRepository
import org.springframework.transaction.annotation.Transactional
import org.springframework.stereotype.Service

@Service
class ProductService(
    private val productRepository: ProductRepository
) {
    fun findAll() = productRepository.findAll()
    @Transactional
    fun saveAll(elems: List<Product>) = productRepository.saveAll(elems)
}