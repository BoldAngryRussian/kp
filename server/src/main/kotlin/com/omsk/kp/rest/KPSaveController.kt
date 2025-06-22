package com.omsk.kp.rest

import com.omsk.kp.domain.service.save_kp.KPSaveService
import com.omsk.kp.domain.service.save_kp.KPUpdateService
import com.omsk.kp.dto.KPSaveDTO
import com.omsk.kp.dto.KPSaveResultDTO
import com.omsk.kp.utils.REST_V1
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody

@RestController
@RequestMapping("${REST_V1}/kp")
class KPSaveController(
    private val kpSaveService: KPSaveService,
    private val kpUpdateService: KPUpdateService
) {
    @PostMapping("/save")
    fun save(@RequestBody dto: KPSaveDTO): KPSaveResultDTO =
        kpSaveService.save(dto)

    @PostMapping("/update")
    fun update(@RequestBody dto: KPSaveDTO): KPSaveResultDTO =
        kpUpdateService.update(dto)
}