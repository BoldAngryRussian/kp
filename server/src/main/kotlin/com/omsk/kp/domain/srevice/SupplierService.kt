package com.omsk.kp.domain.srevice

import com.omsk.kp.domain.repo.SupplierRepository
import org.springframework.stereotype.Service

@Service
class SupplierService(
    private val repo: SupplierRepository
) {
    fun findAll() = repo.findAll()
}