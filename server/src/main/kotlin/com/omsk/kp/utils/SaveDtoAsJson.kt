package com.omsk.kp.utils

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.omsk.kp.dto.KPSaveDTO
import java.io.File

fun saveDtoAsJson(dto: KPSaveDTO, filePath: String) {
    val mapper = jacksonObjectMapper()
    val json = mapper.writerWithDefaultPrettyPrinter().writeValueAsString(dto)
    File(filePath).writeText(json)
}