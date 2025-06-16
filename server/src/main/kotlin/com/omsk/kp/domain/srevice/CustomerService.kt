package com.omsk.kp.domain.srevice

import com.omsk.kp.domain.repo.CustomerRepository
import org.springframework.stereotype.Service

@Service
class CustomerService(
    private val repo: CustomerRepository
) {
    fun findAllShort() = repo.findAllShort()
    fun findById(id: Long) = repo.findById(id)
}