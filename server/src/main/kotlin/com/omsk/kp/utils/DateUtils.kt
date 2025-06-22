package com.omsk.kp.utils

import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

fun toDate(instant: Instant): String {
    val formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy")
    return instant
        .atZone(ZoneId.systemDefault())
        .toLocalDate()
        .format(formatter)
}