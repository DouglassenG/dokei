package com.dokei.admin.repository;

import com.dokei.admin.entity.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoRepository extends JpaRepository<Documento, String> {

    List<Documento> findByTipoOrderByCriadoEmDesc(String tipo);
}