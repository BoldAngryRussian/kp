package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.CommercialOffer
import com.omsk.kp.domain.projection.CommercialOfferFindShort
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface CommercialOfferRepository: JpaRepository<CommercialOffer, Long> {
    @Query(
        value = """
            select 
                p.id, p.manager_id, p.customer_id, TO_CHAR(p.created_at, 'DD-MM-YYYY') as date, p.type,
				c.company, c.phone,
				u.first_name as manager_first_name, u.second_name as manager_second_name, u.third_name as manager_third_name,
                l.weight, l.price_purchase, l.price_transport, l.price_sell, l.marga
            from commercial_offer p
			    inner join customers c on c.id = p.customer_id
			    inner join users u on u.id = p.manager_id
                left outer join commercial_offer_total l on p.id = l.commercial_offer_id
        """,
        nativeQuery = true
    )
    fun findAllShort(): List<CommercialOfferFindShort>
}