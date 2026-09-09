package com.dokei.admin.dto;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Formato simplificado, so com os campos que a tela precisa mostrar.
 * Implementa Serializable porque fica guardado dentro de um bean
 * @ViewScoped (o JSF precisa poder serializar o estado da view).
 */
public record ReciboView(
        String numero,
        String nomeCliente,
        String servicoDescricao,
        BigDecimal valor,
        String status,
        LocalDateTime criadoEm
) implements Serializable {
}