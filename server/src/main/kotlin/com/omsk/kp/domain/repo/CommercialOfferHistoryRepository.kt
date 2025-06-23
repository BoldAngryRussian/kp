package com.omsk.kp.domain.repo

import com.omsk.kp.domain.model.CommercialOfferHistory
import com.omsk.kp.domain.projection.CommercialOfferHistoryFull
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface CommercialOfferHistoryRepository : JpaRepository<CommercialOfferHistory, Long> {
    @Query(
        value = """
            SELECT 
	            h.user_action, u.first_name, u.second_name, u.third_name, TO_CHAR(h.created_at, 'DD-MM-YYYY HH24:MI') AS date
            FROM 
	            public.commercial_offer_history h
                inner join users u on u.id = h.user_id
            where h.commercial_offer_id = :offerId
            order by h.created_at desc
        """,
        nativeQuery = true
    )
    fun findAllByCommercialOfferIdOrdered(offerId: Long): List<CommercialOfferHistoryFull>
}