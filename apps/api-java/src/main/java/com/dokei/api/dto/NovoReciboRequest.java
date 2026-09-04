package com.dokei.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record NovoReciboRequest(

        @NotBlank(message = "userId e obrigatorio")
        String userId,

        @NotBlank(message = "nomeCliente e obrigatorio")
        String nomeCliente,

        @NotBlank(message = "servicoDescricao e obrigatorio")
        String servicoDescricao,

        @NotNull(message = "valor e obrigatorio")
        @DecimalMin(value = "0.01", message = "valor deve ser maior que zero")
        BigDecimal valor,

        @NotBlank(message = "formaPagamento e obrigatoria")
        String formaPagamento,

        @NotNull(message = "data e obrigatoria")
        LocalDate data,

        String observacoes
      )  
    {
  }