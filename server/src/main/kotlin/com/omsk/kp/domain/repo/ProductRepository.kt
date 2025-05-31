package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.Product
import org.springframework.data.jpa.repository.JpaRepository

interface ProductRepository : JpaRepository<Product, Long>