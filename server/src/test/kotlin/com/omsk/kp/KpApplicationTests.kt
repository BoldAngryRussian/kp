package com.omsk.kp

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import com.fasterxml.jackson.module.kotlin.readValue
import com.omsk.dto.TestResultsSavingDTO
import com.omsk.kp.domain.service.save_kp.converter.KPSaveDtoToCommercialOfferDetails
import com.omsk.kp.dto.KPSaveDTO
import com.omsk.kp.service.kp.KPTotalInfoCalculation
import com.omsk.kp.utils.formatToAmount
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource
import org.springframework.core.io.ClassPathResource
import java.nio.file.Files

@SpringBootTest
@ActiveProfiles("test")
class KpApplicationTests {

    private val objectMapper = jacksonObjectMapper()
	private val kpTotalInfoCalculation = KPTotalInfoCalculation()
	private val kpSaveDtoToCommercialOfferDetails = KPSaveDtoToCommercialOfferDetails()

	companion object {

		data class TestFilesDTO(
			val path: String,
			val pathResult: String
		)

		@JvmStatic
		fun jsonFilesProvider(): List<TestFilesDTO> = listOf(
			TestFilesDTO(
				"saving/v1/save_kp_dto_1.json",
				"saving/v1/results.json"
			),
			TestFilesDTO(
				"saving/v2/save_kp_dto_2.json",
				"saving/v2/results.json"
			),
			TestFilesDTO(
				"saving/v3/save_kp_dto_3.json",
				"saving/v3/results.json"
			),
		)
	}

	@ParameterizedTest
	@MethodSource("jsonFilesProvider")
    fun `deserialize KPSaveDTO from JSON`(dto: TestFilesDTO) {
		val offerId = 100L
        val jsonString = ClassPathResource(dto.path).file.toPath()
			.let(Files::readString)
		val resultString = ClassPathResource(dto.pathResult).file.toPath()
			.let(Files::readString)

        val dto: KPSaveDTO = objectMapper.readValue(jsonString)
		val result: TestResultsSavingDTO = objectMapper.readValue(resultString)

		val products = kpSaveDtoToCommercialOfferDetails
			.convert(dto, offerId)
		val total = kpTotalInfoCalculation.calculate(products, dto)

		Assertions.assertTrue { total.marga == result.marga }
		Assertions.assertTrue { total.pricePurchase == result.purchase }
		Assertions.assertTrue { total.priceSell == result.sell }
		Assertions.assertTrue { total.priceTransport == result.transport }
    }

	@Test
	fun `when amount in doube _ then correct format`(){
		val amount = 3.5126E7
		Assertions.assertTrue { "35 126 000.00" == formatToAmount(amount) }
	}
}
