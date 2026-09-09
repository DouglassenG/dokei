package com.dokei.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Libera o apps/web (Next.js, rodando em localhost:3000) para chamar
 * os endpoints /api/** desta API. Sem isso, o navegador bloqueia a
 * chamada por padrao (protecao de CORS), mesmo estando tudo na mesma
 * maquina.
 *
 * Simplificacao consciente: nao ha validacao de token/autenticacao
 * entre o front e esta API ainda (ver DocumentoController — o userId
 * vem direto no corpo da requisicao). Adequado para portfolio; um
 * cenario real precisaria de autenticacao entre servicos aqui.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST")
                .allowedHeaders("*");
    }
}