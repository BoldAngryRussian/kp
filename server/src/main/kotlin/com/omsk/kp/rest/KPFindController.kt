package com.omsk.kp.rest

import com.omsk.kp.service.kp.KPFindDetailsService
import com.omsk.kp.service.kp.KPFindService
import com.omsk.kp.service.kp.KPFindShortService
import com.omsk.kp.utils.REST_V1
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${REST_V1}/offer")
class KPFindController(
    private val kpFindService: KPFindService,
    private val kpFindDetailsService: KPFindDetailsService,
    private val kpFindShortService: KPFindShortService
) {
    @GetMapping("/{id}/details")
    fun findProductsDetailsByOffer(@PathVariable id: Long) = kpFindDetailsService
        .findByOfferId(id)

    @GetMapping("/{id}/find")
    fun findProducts(@PathVariable id: Long) = kpFindService
        .findByOfferId(id)

    @GetMapping("/all/short")
    fun findAllShort() = kpFindShortService.findAll()
}