package com.omsk.kp.rest

import com.omsk.kp.domain.service.UserLoginService
import com.omsk.kp.dto.LoginRequestDTO
import com.omsk.kp.dto.SignUpRequestDTO
import com.omsk.kp.service.SignUpService
import com.omsk.kp.utils.REST_V1
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestBody

@RestController
@RequestMapping("${REST_V1}/auth")
class AuthController(
    private val userLoginService: UserLoginService,
    private val signUpService: SignUpService
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequestDTO): ResponseEntity<Map<String, String>> {
        val info = userLoginService.getTokenWithUser(request)
        return ResponseEntity.ok(
            mapOf(
                "tkp" to info.token,
                "email" to info.email,
                "firstName" to info.firstName,
                "secondName" to info.secondName,
                "thirdName" to info.thirdName,
                "role" to info.role.name,
                "userId" to info.userId
            )
        )
    }

    @PostMapping("/signup")
    fun signUp(@RequestBody request: SignUpRequestDTO): ResponseEntity<Any> {
        signUpService.signUp(request)
        return ResponseEntity.ok().build()
    }

}