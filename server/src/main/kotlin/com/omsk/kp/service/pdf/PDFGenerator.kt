package com.omsk.kp.service.pdf

import org.springframework.stereotype.Component
import com.lowagie.text.*
import com.lowagie.text.pdf.*
import java.awt.Color
import java.io.ByteArrayOutputStream

@Component
class PDFGenerator {
    fun generate(): ByteArray {
        val document = Document(PageSize.A4)
        val out = ByteArrayOutputStream()
        val writer = PdfWriter.getInstance(document, out)

        document.open()

        document.add(Paragraph("Коммерческое предложение"))
        document.add(Paragraph(" "))

        val table = PdfPTable(2) // Три колонки: ID, Name, Price
        table.widthPercentage = 100f
        table.setWidths(floatArrayOf(5f, 2f))

        // Заголовки
        listOf("Название", "Цена").forEach {
            val cell = PdfPCell(Phrase(it))
            cell.backgroundColor = Color.LIGHT_GRAY
            table.addCell(cell)
        }

        val data = listOf(
            PDFGeneratorDTO("Кальмар кольца в панировке 4-9 10*1 ЕАС Китай (27.11.23) 1/10/1", "738"),
            PDFGeneratorDTO("Горбуша ПБГ 24 ТУ ЕАС Меридиан ООО 1/22/11", "450")
        )

        // Данные
        data.forEach { product ->
            table.addCell(product.name)
            table.addCell(product.price.toString())
        }

        document.add(table)
        document.close()
        writer.close()

        return out.toByteArray()
    }
}

data class PDFGeneratorDTO(
    val name: String, val price: String
)