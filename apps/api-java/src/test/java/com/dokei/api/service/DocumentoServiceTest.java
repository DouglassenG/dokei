package com.dokei.api.service;

import com.dokei.api.dto.NovoReciboRequest;
import com.dokei.api.dto.ReciboResponse;
import com.dokei.api.entity.Documento;
import com.dokei.api.repository.DocumentoRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DocumentoServiceTest {

    @Mock
    private DocumentoRepository documentoRepository;

    @InjectMocks
    private DocumentoService documentoService;

    @Test
    void deveGerarNumeroSequencialComBaseNaContagemExistente() {
        NovoReciboRequest request = new NovoReciboRequest(
                "user-1", "Maria Silva", "Consultoria",
                new BigDecimal("150.00"), "PIX", LocalDate.of(2026, 9, 3), "Teste"
        );

        when(documentoRepository.countByUserIdAndTipo("user-1", "recibo")).thenReturn(7L);
        when(documentoRepository.save(any(Documento.class)))
                .thenAnswer(invocacao -> invocacao.getArgument(0));

        ReciboResponse response = documentoService.criarRecibo(request);

        assertThat(response.numero()).isEqualTo("DOK-0008");
        assertThat(response.nomeCliente()).isEqualTo("Maria Silva");
        assertThat(response.status()).isEqualTo("ativo");
    }

    @Test
    void deveLancarNotFoundQuandoReciboNaoExiste() {
        when(documentoRepository.findByNumeroAndTipo("DOK-9999", "recibo"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> documentoService.buscarPorNumero("DOK-9999"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("nao encontrado");
    }
}