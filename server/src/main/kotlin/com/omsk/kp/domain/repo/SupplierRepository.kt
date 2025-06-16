package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.Supplier
import org.springframework.data.jpa.repository.JpaRepository

interface SupplierRepository: JpaRepository<Supplier, Long> {
}