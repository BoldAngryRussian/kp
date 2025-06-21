package com.omsk.kp.rest

import com.omsk.kp.domain.service.UserLoginService
import com.omsk.kp.dto.LoginRequestDTO
import com.omsk.kp.utils.REST_V1
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody

@RestController
@RequestMapping("${REST_V1}/auth")
class AuthController(
    private val userLoginService: UserLoginService
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequestDTO): ResponseEntity<Map<String, String?>> =
        ResponseEntity.ok(
            mapOf("token" to userLoginService.getToken(request))
        )

}