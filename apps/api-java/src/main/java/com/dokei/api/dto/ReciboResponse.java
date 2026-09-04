package com.dokei.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ReciboResponse(
        String id,
        String numero,
        String nomeCliente,
        String servicoDescricao,
        BigDecimal valor,
        String formaPagamento,
        LocalDate data,
        String observacoes,
        String status,
        LocalDateTime criadoEm
) {
}