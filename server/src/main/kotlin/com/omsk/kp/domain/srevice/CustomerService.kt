package com.omsk.kp.domain.srevice

import com.omsk.kp.domain.model.Customer
import com.omsk.kp.domain.model.Supplier
import com.omsk.kp.domain.repo.CustomerRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CustomerService(
    private val repo: CustomerRepository
) {
    @Transactional
    fun save(customer: Customer) = repo.save(customer)

    @Transactional
    fun delete(id: Long) = repo.deleteById(id)

    fun findAllShort() = repo.findAllShort()
    fun findById(id: Long) = repo.findById(id)
}