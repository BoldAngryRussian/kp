package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.Customer
import com.omsk.kp.dto.CustomerShortDTO
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface CustomerRepository: JpaRepository<Customer, Long> {
    @Query(
        value = "SELECT id, company FROM customers",
        nativeQuery = true
    )
    fun findAllShort(): List<CustomerShortDTO>
}