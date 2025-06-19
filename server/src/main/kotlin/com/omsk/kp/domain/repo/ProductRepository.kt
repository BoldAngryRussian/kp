package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.Product
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface ProductRepository : JpaRepository<Product, Long> {
    @Modifying
    @Query(
        value = "delete from product where price_list_id = :priceListId and price_list_version < (:version - 1)",
        nativeQuery = true
    )
    fun clear(priceListId: Long, version: Int)
}