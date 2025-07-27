package com.omsk.kp.domain.model

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.Id
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Entity
data class CommercialOfferAdditionalServices(
    @Id
    @GeneratedValue
    val id: Long? = null,
    val commercialOfferId: Long,
    val type: String,
    val count: Double,
    val price: Double,
    val createdAt: Instant = Instant.now()
)

interface CommercialOfferAdditionalServicesRepository: JpaRepository<CommercialOfferAdditionalServices, Long> {
    @Transactional
    fun deleteByCommercialOfferId(commercialOfferId: Long)
    fun findAllByCommercialOfferId(commercialOfferId: Long): List<CommercialOfferAdditionalServices>
}

@Service
class CommercialOfferAdditionalServicesService(
    private val repo: CommercialOfferAdditionalServicesRepository
) {
    @Transactional
    fun save(entities: List<CommercialOfferAdditionalServices>) = repo.saveAll(entities)
    @Transactional
    fun deleteByOfferId(commercialOfferId: Long) = repo.deleteByCommercialOfferId(commercialOfferId)
    fun findAllByOfferId(commercialOfferId: Long) = repo.findAllByCommercialOfferId(commercialOfferId)
}


