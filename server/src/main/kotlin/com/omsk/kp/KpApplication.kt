package com.omsk.kp

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class KpApplication

fun main(args: Array<String>) {
	runApplication<KpApplication>(*args)
}
