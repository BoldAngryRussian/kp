package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.Supplier
import com.omsk.kp.dto.SupplierShortDTO
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface SupplierRepository: JpaRepository<Supplier, Long> {
    @Query(
        value = "SELECT id, company FROM suppliers",
        nativeQuery = true
    )
    fun findAllShort(): List<SupplierShortDTO>
}