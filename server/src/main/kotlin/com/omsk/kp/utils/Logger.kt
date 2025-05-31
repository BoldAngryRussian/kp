package com.omsk.kp.utils

import org.slf4j.Logger
import org.slf4j.LoggerFactory

object KPLog {
    val log: Logger = LoggerFactory.getLogger(KPLog::class.java)
    fun info(message: String) = log.info(message)
}