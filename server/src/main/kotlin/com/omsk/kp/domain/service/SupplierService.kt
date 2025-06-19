package com.omsk.kp.domain.service

import com.omsk.kp.domain.model.Supplier
import com.omsk.kp.domain.repo.SupplierRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SupplierService(
    private val repo: SupplierRepository
) {
    @Transactional
    fun save(supplier: Supplier) = repo.save(supplier)

    @Transactional
    fun delete(id: Long) = repo.deleteById(id)

    fun findAllShort() = repo.findAllShort()
    fun findById(id: Long) = repo.findById(id)
}