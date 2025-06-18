package com.omsk.kp.domain.srevice

import com.omsk.kp.converter.ProductDtoToProductConverter
import com.omsk.kp.domain.model.PriceList
import com.omsk.kp.dto.SavePriceDTO
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SavePriceService(
    private val priceListService: PriceListService,
    private val handlers: List<SavePriceListSavingStrategy>
) {
    @Transactional
    fun save(dto: SavePriceDTO) {
        val priceList = priceListService
            .findBySupplierIdLocking(dto.supplierId)

        handlers
            .find { it.isMy(priceList) }!!
            .save(priceList, dto)
    }
}

interface SavePriceListSavingStrategy {

    val converter: ProductDtoToProductConverter
    val productService: ProductService

    fun isMy(priceList: PriceList?): Boolean
    fun save(priceList: PriceList? = null, dto: SavePriceDTO)

    fun saveProducts(dto: SavePriceDTO, priceListId: Long, priceListVersion: Int){
        dto
            .products
            .map { converter.convert(it, priceListId, priceListVersion) }
            .let( productService::saveAll )
    }
}

@Component
class SavePriceListSavingNoSupplier(
    override val productService: ProductService,
    private val priceListService: PriceListService,
): SavePriceListSavingStrategy {

    override val converter = ProductDtoToProductConverter()

    override fun isMy(priceList: PriceList?) = priceList == null

    override fun save(priceList: PriceList?, dto: SavePriceDTO) {
        val newPriceList = priceListService
            .save(PriceList(suppliersId = dto.supplierId))
        saveProducts(dto, newPriceList.id!!, newPriceList.version)
    }
}

@Component
class SavePriceListSavingSupplierExists(
    override val productService: ProductService,
): SavePriceListSavingStrategy {

    override val converter = ProductDtoToProductConverter()

    override fun isMy(priceList: PriceList?) = priceList != null

    override fun save(priceList: PriceList?, dto: SavePriceDTO) {
        val version = priceList!!.version + 1
        priceList.version = version
        saveProducts(dto, priceList.id!!, version)
    }
}