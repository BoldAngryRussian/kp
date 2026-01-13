package com.omsk.kp

import com.omsk.kp.domain.projection.CommercialOfferFindShort
import com.omsk.kp.dto.KPInfoTotal
import com.omsk.kp.dto.KPTotalInfoCustomer
import com.omsk.kp.dto.KPTotalInfoManager
import com.omsk.kp.dto.KPTotalInfoResult
import com.omsk.kp.rest.KPFindController
import com.omsk.kp.service.kp.KPFindDetailsService

import com.omsk.kp.service.kp.KPFindService
import com.omsk.kp.service.kp.KPFindSavedDTO
import com.omsk.kp.service.kp.KPFindShortService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.mockito.Mockito.`when`

internal class KPFindControllerTest {

    private val kpFindService: KPFindService = mock()
    private val kpFindDetailsService: KPFindDetailsService = mock()
    private val kpFindShortService: KPFindShortService = mock()

    private val controller = KPFindController(
        kpFindService = kpFindService,
        kpFindDetailsService = kpFindDetailsService,
        kpFindShortService = kpFindShortService
    )


    @Test
    fun `findProductsDetailsByOffer delegates to service and returns result`() {
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

        val actual = controller.findProductsDetailsByOffer(offerId)

        assertEquals(expected, actual)
        verify(kpFindDetailsService).findByOfferId(offerId)
    }

    @Test
    fun `findProducts delegates to service and returns result`() {
        val offerId = 2L
        val expected = KPFindSavedDTO(
            offerId = offerId,
            customerId = 10L,
            desc = "test",
            products = emptyList(),
            additionalServices = emptyList()
        )

        `when`(kpFindService.findByOfferId(offerId)).thenReturn(expected)

        val actual = controller.findProducts(offerId)

        assertEquals(expected, actual)
        verify(kpFindService).findByOfferId(offerId)
    }

    @Test
    fun `findAllShort delegates to service and returns result`() {
        val expected: List<CommercialOfferFindShort> = emptyList()

        `when`(kpFindShortService.findAll()).thenReturn(expected)

        val actual = controller.findAllShort()

        assertEquals(expected, actual)
        verify(kpFindShortService).findAll()
    }
}
