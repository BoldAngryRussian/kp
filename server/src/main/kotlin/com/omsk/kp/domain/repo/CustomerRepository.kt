package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.Customer
import org.springframework.data.jpa.repository.JpaRepository

interface CustomerRepository: JpaRepository<Customer, Long> {
    
}