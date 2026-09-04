package com.dokei.api.repository;

import com.dokei.api.entity.Documento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentoRepository extends JpaRepository<Documento, String> {

    List<Documento> findByUserIdAndTipoOrderByCriadoEmDesc(String userId, String tipo);

    Optional<Documento> findFirstByUserIdAndTipoOrderByCriadoEmDesc(String userId, String tipo);

    Optional<Documento> findByNumeroAndTipo(String numero, String tipo);

    long countByUserIdAndTipo(String userId, String tipo);
}