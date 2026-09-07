package com.dokei.api.controller;

import com.dokei.api.dto.ReciboResponse;
import com.dokei.api.service.DocumentoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DocumentoController.class)
class DocumentoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DocumentoService documentoService;

    @Test
    void devePermitirCriarRecibo() throws Exception {
        String corpo = """
                {
                  "userId": "user-1",
                  "nomeCliente": "Maria Silva",
                  "servicoDescricao": "Consultoria",
                  "valor": 150.00,
                  "formaPagamento": "PIX",
                  "data": "2026-09-03",
                  "observacoes": "Teste"
                }
                """;

        ReciboResponse resposta = new ReciboResponse(
                "abc-123", "DOK-0001", "Maria Silva", "Consultoria",
                new BigDecimal("150.00"), "PIX", LocalDate.of(2026, 9, 3),
                "Teste", "ativo", LocalDateTime.now()
        );

        when(documentoService.criarRecibo(any())).thenReturn(resposta);

        mockMvc.perform(post("/api/recibos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpo))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.numero").value("DOK-0001"))
                .andExpect(jsonPath("$.nomeCliente").value("Maria Silva"));
    }

    @Test
    void deveRejeitarReciboSemNomeCliente() throws Exception {
        String corpoInvalido = """
                {
                  "userId": "user-1",
                  "nomeCliente": "",
                  "servicoDescricao": "Consultoria",
                  "valor": 150.00,
                  "formaPagamento": "PIX",
                  "data": "2026-09-03"
                }
                """;

        mockMvc.perform(post("/api/recibos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(corpoInvalido))
                .andExpect(status().isBadRequest());
    }

    @Test
    void deveBuscarReciboPorNumero() throws Exception {
        ReciboResponse resposta = new ReciboResponse(
                "abc-123", "DOK-0008", "Maria Silva", "Consultoria",
                new BigDecimal("150.00"), "PIX", LocalDate.of(2026, 9, 3),
                "Primeiro teste", "ativo", LocalDateTime.now()
        );

        when(documentoService.buscarPorNumero("DOK-0008")).thenReturn(resposta);

        mockMvc.perform(get("/api/recibos/DOK-0008"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.numero").value("DOK-0008"));
    }
}