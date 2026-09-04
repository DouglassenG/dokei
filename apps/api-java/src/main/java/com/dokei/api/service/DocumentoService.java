package com.dokei.api.service;

import com.dokei.api.dto.NovoReciboRequest;
import com.dokei.api.dto.ReciboResponse;
import com.dokei.api.entity.Documento;
import com.dokei.api.repository.DocumentoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class DocumentoService {

    private static final String TIPO_RECIBO = "recibo";

    private final DocumentoRepository documentoRepository;

    public DocumentoService(DocumentoRepository documentoRepository) {
        this.documentoRepository = documentoRepository;
    }

    public ReciboResponse criarRecibo(NovoReciboRequest request) {
        String numero = gerarProximoNumero(request.userId());

        Map<String, Object> dadosJson = new HashMap<>();
        dadosJson.put("nomeCliente", request.nomeCliente());
        dadosJson.put("servicoDescricao", request.servicoDescricao());
        dadosJson.put("valor", request.valor());
        dadosJson.put("formaPagamento", request.formaPagamento());
        dadosJson.put("data", request.data().toString());
        dadosJson.put("observacoes", request.observacoes());

        Documento documento = new Documento(
                UUID.randomUUID().toString(),
                request.userId(),
                TIPO_RECIBO,
                dadosJson
        );
        documento.setNumero(numero);

        Documento salvo = documentoRepository.save(documento);
        return paraResponse(salvo);
    }

    public ReciboResponse buscarPorNumero(String numero) {
        Documento documento = documentoRepository.findByNumeroAndTipo(numero, TIPO_RECIBO)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Recibo " + numero + " nao encontrado"));
        return paraResponse(documento);
    }

    /**
     * Gera o proximo numero sequencial (DOK-0001, DOK-0002, ...) por usuario.
     * Simplificacao consciente: conta os recibos existentes e soma 1.
     * Nao e seguro contra duas requisicoes simultaneas do mesmo usuario
     * (poderiam gerar o mesmo numero) — aceitavel para portfolio, mas seria
     * o primeiro ponto a evoluir (ex.: sequence no banco) num cenario real.
     */
    private String gerarProximoNumero(String userId) {
        long total = documentoRepository.countByUserIdAndTipo(userId, TIPO_RECIBO);
        long proximo = total + 1;
        return "DOK-%04d".formatted(proximo);
    }

    private ReciboResponse paraResponse(Documento documento) {
        Map<String, Object> dados = documento.getDadosJson();
        return new ReciboResponse(
                documento.getId(),
                documento.getNumero(),
                (String) dados.get("nomeCliente"),
                (String) dados.get("servicoDescricao"),
                new BigDecimal(dados.get("valor").toString()),
                (String) dados.get("formaPagamento"),
                LocalDate.parse((String) dados.get("data")),
                (String) dados.get("observacoes"),
                documento.getStatus(),
                documento.getCriadoEm()
        );
    }
}