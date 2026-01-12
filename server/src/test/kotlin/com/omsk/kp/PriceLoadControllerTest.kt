package com.omsk.kp

import com.omsk.kp.domain.service.save_price_list.SavePriceService
import com.omsk.kp.rest.PriceLoadController
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.springframework.core.io.ClassPathResource
import org.springframework.mock.web.MockMultipartFile
import java.nio.file.Files

internal class PriceLoadControllerTest {


    private val savePriceService: SavePriceService = mock()
    private val controller: PriceLoadController = PriceLoadController(savePriceService)

    @Test
    fun `uploadFile should return OK when file is valid`() {
        val mockFile = MockMultipartFile(
            "file",             // имя параметра @RequestParam
            "hello.txt",        // имя файла
            null,       // Content-Type
            ClassPathResource("import/NFC.xlsx")
                .file
                .toPath()
                .let (Files::readAllBytes)
        )

        Assertions.assertTrue { controller.recognize(mockFile).count() == 2814 }
    }

}