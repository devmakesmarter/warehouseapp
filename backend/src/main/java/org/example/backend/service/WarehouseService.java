package org.example.backend.service;

import org.example.backend.model.entities.Product;
import org.example.backend.model.entities.Warehouse;
import org.example.backend.repository.WarehouseRepo;
import org.example.backend.utils.enums.Category;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {
    private final WarehouseRepo warehouseRepo;

    public WarehouseService(WarehouseRepo warehouseRepo) {
        this.warehouseRepo = warehouseRepo;
        saveTestData();
    }

    public List<Warehouse> getAllWarehouses() {
        return  warehouseRepo.findAll();

    }

    public List<Warehouse> saveTestData() {
        List<Warehouse> listWarehouses = List.of(
                new Warehouse("1", "Hamburg", "Test Adresse 1"),
                new Warehouse("2", "Berlin", "Test Adresse 2"),
                new Warehouse("3", "München", "Test Adresse 3"),
                new Warehouse("4", "Köln", "Test Adresse 4"),
                new Warehouse("5", "Frankfurt", "Test Adresse 5")
        );
        return warehouseRepo.saveAll(listWarehouses);
    }
}
