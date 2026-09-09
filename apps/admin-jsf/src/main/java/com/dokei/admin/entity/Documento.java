package com.dokei.admin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Mapeia a tabela "documentos" (mesma tabela usada pelo api-java), so para
 * leitura aqui no painel admin. O Hibernate nunca cria/altera essa tabela.
 */
@Entity
@Table(name = "documentos")
public class Documento {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @Column(name = "`userId`", nullable = false)
    private String userId;

    @Column(name = "tipo", nullable = false)
    private String tipo;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "`dadosJson`", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> dadosJson;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "numero")
    private String numero;

    @Column(name = "`criadoEm`", nullable = false)
    private LocalDateTime criadoEm;

    protected Documento() {
        // exigido pelo JPA
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getTipo() {
        return tipo;
    }

    public Map<String, Object> getDadosJson() {
        return dadosJson;
    }

    public String getStatus() {
        return status;
    }

    public String getNumero() {
        return numero;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}