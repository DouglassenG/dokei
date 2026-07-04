# ⏱️ Dokei — Gestão Completa para MEI

> Plataforma **100% gratuita** de gestão para Microempreendedores Individuais (MEI) brasileiros, criada para resolver a lacuna aberta pela reforma tributária (LC 214/2025), que estabelece um novo prazo legal para os MEIs a partir de janeiro de 2027.

## 🎯 Motivação e Propósito

A rotina de um MEI brasileiro exige lidar com recibos, controle financeiro, DAS, precificação de serviços e declaração anual (DASN-SIMEI) — geralmente sem nenhuma ferramenta dedicada e gratuita para isso. O Dokei nasceu para ser esse ponto único, simples e sem custo.

O projeto foi construído como um monorepo Turborepo, com autenticação real via Clerk, persistência em PostgreSQL (Supabase) via Prisma, e uma assistente de IA (**Kauane**) para tirar dúvidas sobre MEI dentro do próprio app.

> **Decisões de produto e qualidade aplicadas:**
> * Remoção total do limite de 5 recibos/mês do plano gratuito — a geração de PDF de recibos é **ilimitada para todos os usuários**, validado diretamente na rota `POST /api/recibos`.
> * Suíte de testes E2E migrada de Playwright para **Cypress**, com autenticação real via API do Clerk (sem depender de formulário ou OTP), tornando os testes mais rápidos e determinísticos.
> * Uso de `next/image`, `React.Suspense` e memoização (`useMemo`/`useCallback`) em pontos-chave da interface (landing page, calculadora, sidebar) como boas práticas de performance do React/Next.js.

## 🛠️ Tecnologias Utilizadas

* **[Next.js 16 (App Router) + React 19]:** Framework principal, com Server Components e streaming via Suspense.
* **[TypeScript]:** Tipagem estrita em todo o projeto (sem uso de `any`).
* **[Tailwind CSS v4 + shadcn/ui]:** Estilização utilitária e componentes acessíveis.
* **[Clerk]:** Autenticação e gerenciamento de sessão, localizado em pt-BR.
* **[Prisma 5 + PostgreSQL (Supabase)]:** ORM e banco de dados relacional.
* **[React Hook Form + Zod]:** Formulários com validação tipada.
* **[@react-pdf/renderer]:** Geração de PDFs de recibos no navegador.
* **[Groq SDK (`llama-3.3-70b-versatile`)]:** Motor da assistente de IA Kauane.
* **[Recharts]:** Visualização de dados no controle financeiro.
* **[Turborepo + pnpm workspaces]:** Orquestração do monorepo.
* **[Cypress]:** Testes automatizados end-to-end.

## ✨ Funcionalidades

1. **Emissão de Recibos:** Geração de PDF numerado sequencialmente (`DOK-0001`, `DOK-0002`...), sem limite de quantidade.
2. **Controle Financeiro:** Lançamentos separados por carteira ("Negócio" / "Pessoal"), com extrato e gráficos.
3. **Lembretes de DAS:** Acompanhamento de vencimentos e status (pendente/pago).
4. **Calculadora de Precificação:** Cálculo de preço de serviço com memoização (`useMemo`) para evitar recomputações desnecessárias.
5. **Declaração de Rendimentos:** Apoio à DASN-SIMEI anual.
6. **Kauane (Assistente de IA):** Chat integrado para dúvidas sobre MEI, recibos, DAS e planos, com respostas limitadas ao escopo do Dokei.

## ✅ Testes Automatizados (Cypress)

O projeto migrou de Playwright para Cypress, consolidando a suíte em `apps/web/cypress/`. O maior desafio resolvido foi autenticar os testes sem passar pela UI de login: `cy.login()` cria uma sessão real via API do Clerk (`POST /v1/sessions` → `POST /v1/sessions/{id}/tokens`) e injeta os cookies `__session` e `__client_uat` diretamente no navegador do Cypress.

**Cenários cobertos em `login.cy.ts`:**

| # | Cenário | O que valida |
|---|---|---|
| 1 | Acesso direto ao dashboard | Usuário autenticado acessa `/dashboard` sem redirecionamento |
| 2 | Exibição das 5 funcionalidades | Cards de Recibo, Financeiro, Lembretes, Calculadora e Rendimentos visíveis |
| 3 | Sidebar exibe e-mail do usuário | Sessão injetada reflete os dados reais do Clerk |
| 4 | Navegação → Emitir Recibo | Card leva corretamente a `/recibos/novo` |
| 5 | Navegação → Controle Financeiro | Card leva corretamente a `/financeiro` |
| 6 | Responsividade mobile (375×812) | Sidebar oculta por padrão e abre via botão hambúrguer |
| 7 | Proteção de rotas | Visitante sem sessão é redirecionado de `/dashboard` para `/login` |

A configuração (`cypress.config.ts`) roda com 2 *retries* automáticos em modo terminal (`runMode`) para reduzir flakiness, e 0 em modo visual (`openMode`).

**Rodando os testes localmente:**

```powershell
cd apps\web
pnpm test:e2e        # modo headless (terminal/CI)
pnpm test:e2e:open   # modo interativo (Cypress UI)
```

> ⚠️ Os testes exigem `CLERK_SECRET_KEY` e `CLERK_USER_ID` de um usuário de teste, definidos em `cypress.env.json` ou como variáveis de ambiente. A suíte hoje roda apenas localmente — ainda não há workflow de CI configurado no repositório.

## 📂 Estrutura de Arquivos

A organização segue o padrão de monorepo Turborepo, com o app principal em `apps/web`:

```text
dokei/
├── apps/
│   └── web/                     # Aplicação Next.js principal
│       ├── cypress/             # Testes E2E automatizados
│       │   ├── e2e/             # Specs de teste (login.cy.ts)
│       │   └── support/         # Comandos customizados (cy.login) e setup
│       ├── prisma/               # Schema do banco (PostgreSQL)
│       ├── src/
│       │   ├── app/
│       │   │   ├── (auth)/       # Login e cadastro
│       │   │   ├── (dashboard)/  # Dashboard, financeiro, recibos, calculadora, rendimentos, obrigações
│       │   │   ├── api/          # Rotas de API (recibos, financeiro, lembretes, rendimentos, chat)
│       │   │   └── r/[numero]/   # Página pública de visualização de recibo
│       │   ├── components/
│       │   │   ├── landing/      # Hero, Navbar, Services, FAQ, CTA, Footer, Mockup
│       │   │   ├── dashboard/    # Sidebar, Cards, ThemeToggle
│       │   │   ├── chat/         # Widget da assistente Kauane
│       │   │   ├── pdf/          # Template do recibo em PDF
│       │   │   └── ui/           # Componentes shadcn/ui
│       │   ├── lib/              # Auth helpers, Prisma client, validações (Zod)
│       │   └── middleware.ts     # Proteção de rotas via Clerk
│       └── cypress.config.ts
├── packages/                    # Pacotes compartilhados (ui, eslint-config, typescript-config)
├── turbo.json                   # Configuração do Turborepo
└── pnpm-workspace.yaml
```
