package com.dokei.api.entity;

import java.time.LocalDateTime;
import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.domain.Persistable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PostLoad;
import jakarta.persistence.PostPersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

/**
 * Mapeia a tabela "documentos", que ja existe e e administrada pelo Prisma
 * (apps/web/prisma/schema.prisma). E um modelo polimorfico: um "recibo" e
 * um Documento com tipo = "recibo", com os campos especificos guardados em
 * dadosJson (jsonb). O Hibernate nunca cria/altera essa tabela — ver
 * spring.jpa.hibernate.ddl-auto=none em application.properties.
 */
@Entity
@Table(name = "documentos")
public class Documento implements Persistable<String> {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @Column(name = "userId", nullable = false)
    private String userId;

    @Column(name = "tipo", nullable = false)
    private String tipo;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dadosJson", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> dadosJson;

    @Column(name = "status", nullable = false)
    private String status = "ativo";

    @Column(name = "numero")
    private String numero;

    @Column(name = "criadoEm", nullable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @Transient
    private boolean novoRegistro = true;

    protected Documento() {
        // exigido pelo JPA
    }

    public Documento(String id, String userId, String tipo, Map<String, Object> dadosJson) {
        this.id = id;
        this.userId = userId;
        this.tipo = tipo;
        this.dadosJson = dadosJson;
    }

    @PostLoad
    @PostPersist
    private void marcarComoExistente() {
        this.novoRegistro = false;
    }

    @Override
    public String getId() {
        return id;
    }

    @Override
    public boolean isNew() {
        return novoRegistro;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Map<String, Object> getDadosJson() {
        return dadosJson;
    }

    public void setDadosJson(Map<String, Object> dadosJson) {
        this.dadosJson = dadosJson;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}