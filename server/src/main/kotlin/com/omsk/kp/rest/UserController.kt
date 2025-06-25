package com.omsk.kp.rest

import com.omsk.kp.domain.service.UserService
import com.omsk.kp.domain.service.UserUpdateService
import com.omsk.kp.dto.UserDataDTO
import com.omsk.kp.dto.UserPasswordDTO
import com.omsk.kp.utils.REST_V1
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("${REST_V1}/user")
class UserController(
    private val userService: UserService,
    private val userUpdateService: UserUpdateService
) {
    @GetMapping("/{id}")
    fun find(@PathVariable id: Long) = userService
        .findById(id)
        ?.let { UserDataDTO(it) }

    @PutMapping("/{id}/update")
    fun update(@PathVariable id: Long, @RequestBody dto: UserDataDTO) = userUpdateService
        .update(id, dto)

    @PutMapping("password/{id}/update")
    fun passwordUpdate(@PathVariable id: Long, @RequestBody dto: UserPasswordDTO) = userUpdateService
        .updatePassword(id, dto)
}