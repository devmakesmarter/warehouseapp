package org.example.backend.service;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class BarCodeService {
    public  BarCodeService(){}

    public String  createBarCode(){
        return UUID.randomUUID().toString();
    }
}
