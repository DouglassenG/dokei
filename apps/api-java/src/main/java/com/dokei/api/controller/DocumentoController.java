package com.dokei.api.controller;

import com.dokei.api.dto.NovoReciboRequest;
import com.dokei.api.dto.ReciboResponse;
import com.dokei.api.service.DocumentoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recibos")
public class DocumentoController {

    private final DocumentoService documentoService;

    public DocumentoController(DocumentoService documentoService) {
        this.documentoService = documentoService;
    }

    @PostMapping
    public ResponseEntity<ReciboResponse> criar(@Valid @RequestBody NovoReciboRequest request) {
        ReciboResponse response = documentoService.criarRecibo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{numero}")
    public ResponseEntity<ReciboResponse> buscarPorNumero(@PathVariable String numero) {
        ReciboResponse response = documentoService.buscarPorNumero(numero);
        return ResponseEntity.ok(response);
    }
}