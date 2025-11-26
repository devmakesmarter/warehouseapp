package org.example.backend.service;

import org.example.backend.model.dto.InboundOrderDto;
import org.example.backend.model.entities.InboundOrder;
import org.example.backend.model.entities.Product;
import org.example.backend.model.entities.Supplier;
import org.example.backend.repository.InboundOrderRepo;
import org.example.backend.repository.ProductRepo;
import org.example.backend.repository.SupplierRepo;
import org.example.backend.utils.enums.Category;
import org.example.backend.utils.enums.Status;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepo productRepo;
    private final InboundOrderRepo inboundOrderRepo;
    private final SupplierRepo supplierRepo;

    Product defaultproduct=new Product("1","testproduct","123445", "testprodukt",1, Category.CLOTHING);


    public ProductService(ProductRepo productRepo, InboundOrderRepo inboundOrderRepo, SupplierRepo supplierRepo) {
        this.productRepo = productRepo;
        this.inboundOrderRepo = inboundOrderRepo;
        this.supplierRepo = supplierRepo;
        this.productRepo.save(defaultproduct);
    }

    public List<Product> getAllProducts() {
        return  productRepo.findAll();
    }

    public Product getProductById(String id) {
        return productRepo.findById(id).orElse(null);
    }

    public Product updateProduct(String id, Product product) {
        Product oldData = productRepo.findById(id).orElse(null);
        if (oldData != null) {
            productRepo.save(
                    oldData.
                            withName(product.name()).
                            withBarcode(product.barcode()).
                            withCategory(product.category()).
                            withDescription(product.description())
                    );
        }
        return  product;
    }

    public Product create(InboundOrderDto inboundOrderDto) {
//        inboundOrderDto.product().withBarcode(generateBarcode());
        Product newProduct = productRepo.save(inboundOrderDto.product());
        Supplier newSupplier = supplierRepo.save(inboundOrderDto.supplier());
        inboundOrderRepo.save(
                inboundOrderRepo.save(
                        InboundOrder.builder()
                                .supplierId(newSupplier.id())
                                .productId(newProduct.id())
                                .items(inboundOrderDto.items())
                                .inDate(LocalDateTime.now())
                                .status(Status.NEW)
                                .build()
                )
        );
        return productRepo.save(newProduct);
    }

    public void deleteProduct(String id) {
        productRepo.deleteById(id);
    }

    private String generateBarcode() {
        return UUID.randomUUID().toString();
    }
}
