package com.omsk.kp.domain.srevice

import com.omsk.kp.domain.repo.SupplierRepository
import org.springframework.stereotype.Service

@Service
class SupplierService(
    private val repo: SupplierRepository
) {
    fun findAllShort() = repo.findAllShort()
    fun findById(id: Long) = repo.findById(id)
}