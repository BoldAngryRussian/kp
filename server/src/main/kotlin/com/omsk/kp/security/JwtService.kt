package com.omsk.kp.security

import com.omsk.kp.domain.model.UserRoleType
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jws
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService {

    fun generateToken(userName: String, roles: List<UserRoleType>): String {
        val claims = Jwts.claims().setSubject(userName)
        claims["roles"] = roles.map { it.name }
        val date = Date()
        return Jwts
            .builder()
            .setClaims(claims)
            .setIssuedAt(date)
            .setExpiration(Date(date.time + EXPIRATION_JWT_MS))
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun extractUsername(token: String) =
        try {
            parseToken(token)
                .body
                .subject
        } catch (e: Exception){
            null
        }

    fun extractRoles(token: String): List<String> =
        try {
            val roles = parseToken(token).body["roles"]
            if (roles is List<*>) {
                roles.filterIsInstance<String>()
            } else {
                emptyList()
            }
        } catch (e: Exception) {
            emptyList()
        }

    fun isTokenValid(token: String): Boolean {
        return try {
            val claims = parseToken(token).body
            val expiration = claims.expiration
            expiration.after(Date()) // ← true, если срок действия токена ещё не истёк
        } catch (e: Exception) {
            false
        }
    }

    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {
        return try {
            val claims = parseToken(token).body

            val usernameInToken = claims.subject
            val isUsernameValid = usernameInToken == userDetails.username

            val isNotExpired = claims.expiration.after(Date())

            isUsernameValid && isNotExpired
        } catch (e: Exception) {
            false
        }
    }

    private fun parseToken(token: String): Jws<Claims> {
        return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
    }

    companion object {
        private const val EXPIRATION_JWT_MS: Long = 24 * 60 * 60 * 1000 // 1 день
        private val secretKey: SecretKey = Keys.hmacShaKeyFor(
            """
                    Is education residence conveying so so. Suppose shyness say ten behaved morning had. Any unsatiable assistance compliment occasional too reasonably advantages. Unpleasing has ask acceptance partiality alteration understood two. Worth no tiled my at house added. Married he hearing am it totally removal. Remove but suffer wanted his lively length. Moonlight two applauded conveying end direction old principle but. Are expenses distance weddings perceive strongly who age domestic.
                    Improved own provided blessing may peculiar domestic. Sight house has sex never. No visited raising gravity outward subject my cottage mr be. Hold do at tore in park feet near my case. Invitation at understood occasional sentiments insipidity inhabiting in. Off melancholy alteration principles old. Is do speedily kindness properly oh. Respect article painted cottage he is offices parlors.
                    Started his hearted any civilly. So me by marianne admitted speaking. Men bred fine call ask. Cease one miles truth day above seven. Suspicion sportsmen provision suffering mrs saw engrossed something. Snug soon he on plan in be dine some.
                    So delightful up dissimilar by unreserved it connection frequently. Do an high room so in paid. Up on cousin ye dinner should in. Sex stood tried walls manor truth shy and three his. Their to years so child truth. Honoured peculiar families sensible up likewise by on in.
                    Shot what able cold new the see hold. Friendly as an betrayed formerly he. Morning because as to society behaved moments. Put ladies design mrs sister was. Play on hill felt john no gate. Am passed figure to marked in. Prosperous middletons is ye inhabiting as assistance me especially. For looking two cousins regular amongst.
                    To sure calm much most long me mean. Able rent long in do we. Uncommonly no it announcing melancholy an in. Mirth learn it he given. Secure shy favour length all twenty denote. He felicity no an at packages answered opinions juvenile.
                    Had repulsive dashwoods suspicion sincerity but advantage now him. Remark easily garret nor nay. Civil those mrs enjoy shy fat merry. You greatest jointure saw horrible. He private he on be imagine suppose. Fertile beloved evident through no service elderly is. Blind there if every no so at. Own neglected you preferred way sincerity delivered his attempted. To of message cottage windows do besides against uncivil.
                    Now for manners use has company believe parlors. Least nor party who wrote while did. Excuse formed as is agreed admire so on result parish. Put use set uncommonly announcing and travelling. Allowance sweetness direction to as necessary. Principle oh explained excellent do my suspected conveying in. Excellent you did therefore perfectly supposing described.
                    Far concluded not his something extremity. Want four we face an he gate. On he of played he ladies answer little though nature. Blessing oh do pleasure as so formerly. Took four spot soon led size you. Outlived it received he material. Him yourself joy moderate off repeated laughter outweigh screened.
                    Sense child do state to defer mr of forty. Become latter but nor abroad wisdom waited. Was delivered gentleman acuteness but daughters. In as of whole as match asked. Pleasure exertion put add entrance distance drawings. In equally matters showing greatly it as. Want name any wise are able park when. Saw vicinity judgment remember finished men throwing.
                """.trimIndent()
                .toByteArray()
        )
    }
}