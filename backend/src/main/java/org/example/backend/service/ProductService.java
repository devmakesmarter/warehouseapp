package org.example.backend.service;

import org.example.backend.model.dto.InboundOrderDto;
import org.example.backend.model.dto.NewProductDTO;
import org.example.backend.model.entities.InboundOrder;
import org.example.backend.model.entities.Product;
import org.example.backend.model.entities.Supplier;
import org.example.backend.repository.InboundOrderRepo;
import org.example.backend.repository.ProductRepo;
import org.example.backend.repository.SupplierRepo;
import org.example.backend.utils.enums.Category;
import org.example.backend.utils.enums.Status;
import org.springframework.stereotype.Service;
import org.example.backend.service.IDService;
import org.example.backend.service.BarCodeService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {
    private final ProductRepo productRepo;
    private final InboundOrderRepo inboundOrderRepo;
    private final SupplierRepo supplierRepo;
    //private final IDService idService;
   // private final BarCodeService barCodeService;

    Product defaultproduct=new Product("1","testproduct","123445", "testprodukt",1, Category.CLOTHING);


    public ProductService(ProductRepo productRepo,
                          InboundOrderRepo inboundOrderRepo,
                          SupplierRepo supplierRepo
                          //IDService idService,
                          // BarCodeService barCodeService
                          ) {
        this.productRepo = productRepo;
        this.inboundOrderRepo = inboundOrderRepo;
        this.supplierRepo = supplierRepo;
        // this.idService = idService;
        //this.barCodeService = barCodeService;
        this.productRepo.save(defaultproduct);
    }

    public List<Product> getAll() {
        return  productRepo.findAll();
    }

    public Product getById(String id) {
        return productRepo.findById(id).orElse(null);
    }

    public Product update(String id, Product product) {
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

    public Product addProduct(NewProductDTO newProduct) {
        //         @Id String id,
        //        String name,
        //        String barcode,
        //        String description,
        //        int quantity,
        //        Category category
        //
        //        String name,
        //        String barcode,
        //        String description,
        //        int quantity,
        //        Category category) {
        String newId = UUID.randomUUID().toString();
        String newBarcode = UUID.randomUUID().toString();

        Product productToAdd= new Product(newId, newProduct.name(), newBarcode, newProduct.description(),newProduct.quantity(),newProduct.category());
        productRepo.save(productToAdd);
        return productToAdd;
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

    public void delete(String id) {
        productRepo.deleteById(id);
    }
}
