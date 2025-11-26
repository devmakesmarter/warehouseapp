package org.example.backend.controller;

import org.example.backend.model.dto.NewProductDTO;
import org.example.backend.model.entities.Product;
import org.example.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/warehouse")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping("/product")
    public Product addProduct(@RequestBody NewProductDTO newProduct) {
        //System.out.println(newProduct);
        //NewProductDTO test=new NewProductDTO(newProduct.name(),newProduct.barcode(),newProduct.description(),newProduct.quantity(), Category.CLOTHING);
        return productService.addProduct(newProduct);
    }
}
