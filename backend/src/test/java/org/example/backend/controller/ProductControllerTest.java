package org.example.backend.controller;

import org.example.backend.model.entities.Product;
import org.example.backend.repository.InboundOrderRepo;
import org.example.backend.repository.ProductRepo;
import org.example.backend.repository.SupplierRepo;
import org.example.backend.service.ProductService;
import org.example.backend.utils.enums.Category;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ProductControllerTest {



    @Test
    void getAllProducts_shouldReturnAllProducts_whenCalledWithValidData() {
        //Given
        Product defaultproduct=new Product("1","testproduct","123445", "testprodukt",1, Category.CLOTHING);
        Product secondproduct = new Product("2","testproductzwei","123445789", "testproduktzwei",1, Category.COSMETICS);
        List<Product> products = List.of(defaultproduct, secondproduct);




        //Mockito
        ProductService mockProductService = mock(ProductService.class);
        ProductController controller = new ProductController(mockProductService);
        List <Product> axb = products;

        //When
        when(mockProductService.getAll()).thenReturn(axb);

        List<Product> result = controller.getAllProducts();

        assertEquals(products,result);

    }
}