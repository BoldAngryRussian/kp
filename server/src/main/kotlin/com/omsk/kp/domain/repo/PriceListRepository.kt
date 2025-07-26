package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.PriceList
import com.omsk.kp.domain.projection.PriceListDownloadDTO
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface PriceListRepository: JpaRepository<PriceList, Long> {
    @Query(
        value = "SELECT * FROM price_list WHERE suppliers_id = ? FOR UPDATE",
        nativeQuery = true
    )
    fun findWithLocking(suppliersId: Long): PriceList?

    fun findBySuppliersId(supplierId: Long): PriceList?

    @Query(
        value = """
            select 
                p.name, (p.price + (p.price * :multiPlicator / 100) ) / 100 as price, p.measurement
            from 
                price_list list
            inner join public.product p on p.price_list_id = list.id and p.price_list_version = list.version 
            order by p.name
        """,
        nativeQuery = true
    )
    fun findPriceListForDownload(multiPlicator: Int = 0): List<PriceListDownloadDTO>
}