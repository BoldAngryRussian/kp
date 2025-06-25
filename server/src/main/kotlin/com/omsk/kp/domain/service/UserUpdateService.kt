package com.omsk.kp.domain.service

import com.omsk.kp.dto.UserDataDTO
import com.omsk.kp.dto.UserPasswordDTO
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserUpdateService(
    private val userService: UserService,
    private val passwordEncoder: PasswordEncoder
) {
    @Transactional
    fun update(id: Long, dto: UserDataDTO): Long {
        val user = find(id)

        user.firstName = dto.firstName
        user.secondName = dto.secondName
        user.thirdName = dto.thirdName
        user.email = dto.email
        user.phone = dto.phone
        user.details = dto.details

        return userService
            .save(user)
            .id!!
    }

    @Transactional
    fun updatePassword(id: Long, dto: UserPasswordDTO): Long {
        val user = find(id)
        val passwordHashFromUI = passwordEncoder.encode(dto.old)
        if (passwordHashFromUI == user.passwordHash){
            user.passwordHash = passwordEncoder.encode(dto.new)
            userService.save(user)
        } else {
            throw RuntimeException("Пароль не верен!")
        }

        return user.id!!
    }

    private fun find(id: Long) = userService
        .findById(id)
        ?: throw RuntimeException("Пользователь $id не найден!")
}