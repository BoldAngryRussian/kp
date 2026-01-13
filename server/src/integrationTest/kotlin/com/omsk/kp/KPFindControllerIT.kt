package com.omsk.kp

import com.omsk.kp.dto.KPInfoTotal
import com.omsk.kp.dto.KPTotalInfoCustomer
import com.omsk.kp.dto.KPTotalInfoManager
import com.omsk.kp.dto.KPTotalInfoResult
import com.omsk.kp.service.kp.KPFindDetailsService
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@AutoConfigureMockMvc
class KPFindControllerIT : IntegrationTestBase() {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var kpFindDetailsService: KPFindDetailsService

    @Test
    fun `GET offer details returns 200 and body (happy path)`() {
        val offerId = 1L
        val expected = KPTotalInfoResult(
            customerName = "Customer",
            created = "2024-01-01",
            customer = KPTotalInfoCustomer(
                name = "Customer",
                address = null,
                phone = "123",
                email = null
            ),
            manager = KPTotalInfoManager(
                name = "Manager",
                phone = "321",
                email = "m@test"
            ),
            finance = KPInfoTotal(
                weight = 0.0,
                pricePurchase = 1.0,
                priceTransport = 3.0,
                priceSell = 2.0,
                additionalServices = 0.0,
                marga = 4.0
            ),
            products = emptyList(),
            weightByTemperatureMode = emptyList(),
            history = emptyList(),
            additionalServices = emptyList()
        )

        `when`(kpFindDetailsService.findByOfferId(offerId)).thenReturn(expected)

        mockMvc.perform(
            get("/api/v1/offer/{id}/details", offerId)
                .accept(MediaType.APPLICATION_JSON)
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.customerName").value("Customer"))
            .andExpect(jsonPath("$.created").value("2024-01-01"))
    }
}
