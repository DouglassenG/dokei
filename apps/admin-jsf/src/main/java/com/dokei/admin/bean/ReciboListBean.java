package com.dokei.admin.bean;

import com.dokei.admin.dto.ReciboView;
import com.dokei.admin.entity.Documento;
import com.dokei.admin.repository.DocumentoRepository;
import jakarta.annotation.PostConstruct;
import jakarta.faces.view.ViewScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Named
@ViewScoped
public class ReciboListBean implements Serializable {

    private static final String TIPO_RECIBO = "recibo";

    @Inject
    private DocumentoRepository documentoRepository;

    private List<ReciboView> recibos;

    @PostConstruct
    public void carregar() {
        recibos = documentoRepository.findByTipoOrderByCriadoEmDesc(TIPO_RECIBO)
                .stream()
                .map(this::paraView)
                .toList();
    }

    private ReciboView paraView(Documento documento) {
        Map<String, Object> dados = documento.getDadosJson();
        Object valorBruto = dados.get("valor");

        return new ReciboView(
                documento.getNumero(),
                (String) dados.get("nomeCliente"),
                (String) dados.get("servicoDescricao"),
                valorBruto != null ? new BigDecimal(valorBruto.toString()) : null,
                documento.getStatus(),
                documento.getCriadoEm()
        );
    }

    public List<ReciboView> getRecibos() {
        return recibos;
    }
}