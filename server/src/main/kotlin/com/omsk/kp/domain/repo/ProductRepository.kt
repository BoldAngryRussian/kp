package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.Product
import com.omsk.kp.domain.projection.ProductShort
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

    @Query(
        value = """
            select p.id, p.name, p.price, spl.company as company from product p
            inner join price_list l on p.price_list_id = l.id and p.price_list_version = l.version
            inner join suppliers spl on l.suppliers_id = spl.id
        """,
        nativeQuery = true
    )
    fun findAllShort(): List<ProductShort>
}