package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.PriceList
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface PriceListRepository: JpaRepository<PriceList, Long> {
    @Query(
        value =
            """
            SELECT COALESCE(MAX(version), 0) 
            FROM price_list 
            WHERE suppliers_id = ? 
            FOR UPDATE
            """,
        nativeQuery = true
    )
    fun findWithLocking(suppliersId: Long): PriceList?

    fun findBySuppliersId(supplierId: Long): PriceList?
}