# 🧾 Dokei — Gestão Completa para MEI

**Dokei** é uma plataforma SaaS **100% gratuita** para Microempreendedores Individuais (MEI) brasileiros gerenciarem recibos, finanças, obrigações fiscais e declarações, tudo em um único lugar, com uma assistente de IA integrada para tirar dúvidas.

## 🎯 Motivação e Propósito

A rotina de um MEI no Brasil normalmente envolve emitir recibos, controlar entradas e saídas, acompanhar o vencimento do DAS, calcular o preço dos próprios serviços e declarar o faturamento anual (DASN-SIMEI) — quase sempre sem nenhuma ferramenta dedicada e gratuita para isso.

O projeto ganha urgência real com a reforma tributária (LC 214/2025), que estabelece um novo prazo legal para os MEIs a partir de janeiro de 2027. O Dokei existe para centralizar essas tarefas em um único produto, gratuito e simples de usar.

**Decisões de produto e qualidade aplicadas (verificadas no código):**
* Remoção total do limite de 5 recibos/mês do plano gratuito — a geração de PDF de recibos é **ilimitada para todos os usuários**, confirmado diretamente na rota `POST /api/recibos`.
* Suíte de testes E2E migrada de Playwright para **Cypress**, com autenticação real via API do Clerk (sem depender de formulário ou OTP), tornando os testes mais rápidos e determinísticos.
* Uso de `next/image`, `React.Suspense` e memoização (`useMemo`/`useCallback`) em pontos-chave da interface (landing page, calculadora, sidebar) como boas práticas de performance do React/Next.js.

## 🛠️ Tecnologias Utilizadas

* **Next.js 16 (App Router) + React 19** — framework principal, com Server Components e streaming via `Suspense`.
* **TypeScript** — tipagem estrita em todo o projeto.
* **Tailwind CSS v4 + shadcn/ui** — estilização utilitária e componentes acessíveis.
* **Clerk** — autenticação e gerenciamento de sessão, localizado em pt-BR.
* **Prisma 5 + PostgreSQL (Supabase)** — ORM e banco de dados relacional.
* **React Hook Form + Zod** — formulários com validação tipada.
* **@react-pdf/renderer** — geração de PDFs de recibos no navegador.
* **Groq SDK (`llama-3.3-70b-versatile`)** — motor da assistente de IA Kauane.
* **Recharts** — visualização de dados no controle financeiro.
* **Turborepo + pnpm workspaces** — orquestração do monorepo.
* **Cypress** — testes automatizados end-to-end.

## ✨ Funcionalidades

1. **Emissão de Recibos** — geração de PDF numerado sequencialmente (`DOK-0001`, `DOK-0002`...), sem limite de quantidade, com página pública de visualização (`/r/[numero]`).
2. **Controle Financeiro** — lançamentos separados por carteira ("Negócio" / "Pessoal"), com extrato e gráficos (Recharts).
3. **Lembretes de DAS** — acompanhamento de vencimentos e status (pendente/pago), com rota de geração automática protegida por `CRON_SECRET`.
4. **Calculadora de Precificação** — cálculo de preço de serviço com memoização (`useMemo`) para evitar recomputações desnecessárias.
5. **Declaração de Rendimentos** — apoio à DASN-SIMEI anual.
6. **Kauane (Assistente de IA)** — chat integrado para dúvidas sobre MEI, recibos, DAS e planos, com respostas limitadas ao escopo do Dokei.

## 🏗️ Arquitetura e Resultados Mensuráveis

Métricas extraídas **diretamente do código-fonte** (contagem real de arquivos, não estimativa):

* **84,6% das páginas (11 de 13 rotas `page.tsx` do App Router) são Server Components** — não declaram `"use client"`, ou seja, são renderizadas no servidor por padrão do Next.js 16. Apenas 2 rotas (`calculadora` e `financeiro/extrato`) precisam de interatividade no cliente e usam `"use client"`.
* **47,8% dos arquivos `.tsx` do projeto (22 de 46, somando `app/` + `components/`) são Server Components**, o restante concentra-se em pontos que exigem estado/interatividade real: formulários, sidebar, chat da Kauane e animações da landing page.
* **Cleanup consistente em `useEffect`** em todos os componentes da landing page que registram listeners/observers/timers — `LandingMockup.tsx`, `LandingCTA.tsx`, `LandingFAQ.tsx` e `LandingNavbar.tsx` retornam função de limpeza (`observer.disconnect()`, `clearInterval()`, `removeEventListener()`), evitando vazamento de listeners ao desmontar a página.
* **Build de produção (`next build` com Turbopack) compila com sucesso**, confirmado em teste isolado — validação de que a base de código está livre de erros de sintaxe/import antes do deploy.

> ⚠️ **Nota de transparência:** métricas de performance em runtime (Lighthouse, First Load JS por rota, Time to Interactive) exigem um build completo contra um banco de dados real — o Prisma Client depende de um binário de engine que não é baixado em ambientes com rede restrita. Os números acima são os únicos que puderam ser 100% verificados a partir do repositório; nenhum percentual de "redução de carregamento" foi estimado sem medição real.

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

## 📋 Pré-requisitos

* **Node.js** ≥ 18
* **pnpm** ≥ 9 (`packageManager` fixado em `pnpm@9.0.0`)
* Conta e projeto no **[Supabase](https://supabase.com)** (ou outro Postgres) para `DATABASE_URL` / `DIRECT_URL`
* Conta na **[Clerk](https://clerk.com)** para as chaves de autenticação
* Chave de API da **[Groq](https://console.groq.com)** para o chat da Kauane funcionar

## ⚙️ Instalação

```powershell
# 1. Clonar o repositório
git clone https://github.com/DouglassenG/dokei.git
cd dokei

# 2. Instalar as dependências do monorepo (raiz + workspaces)
pnpm install

# 3. Configurar variáveis de ambiente (dentro de apps/web)
cd apps\web
notepad .env.local
```

Variáveis necessárias em `apps/web/.env.local` (levantadas diretamente do código-fonte):

```env
# Banco de dados (Prisma / Supabase)
DATABASE_URL=
DIRECT_URL=

# Autenticação (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Assistente de IA (Kauane)
GROQ_API_KEY=

# URL pública da aplicação (usada em links/e-mails)
NEXT_PUBLIC_APP_URL=

# Protege a rota de geração automática de lembretes
CRON_SECRET=
```

```powershell
# 4. Sincronizar o schema do banco (não há migrations versionadas no repo)
npx prisma db push --schema=./prisma/schema.prisma

# 5. Rodar o projeto em modo desenvolvimento
cd ..\..
pnpm dev
```

A aplicação sobe em `http://localhost:3000` (porta fixada em `next dev --port 3000`).

## 💻 Uso/Exemplos

**Emitir um recibo (via API):**

```ts
// POST /api/recibos
const resposta = await fetch("/api/recibos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    cliente: "João da Silva",
    servico: "Consultoria de marketing",
    valor: 1500.0,
  }),
})
```

**Calcular preço de serviço (memoizado no client):**

```ts
// src/app/(dashboard)/calculadora/page.tsx
const resultado = useMemo(() => {
  // recalcula apenas quando os inputs do formulário mudam
}, [custos, horasTrabalhadas, margemLucro])
```

**Rodar os testes E2E:**

```powershell
cd apps\web
pnpm test:e2e        # modo headless (terminal/CI)
pnpm test:e2e:open   # modo interativo (Cypress UI)
```

## ⚠️ Erros Conhecidos

* **Erros do Prisma sem `prisma generate`/`db push`:** em ambiente local recém-clonado, chamadas que dependem do Prisma Client falham até que o schema seja sincronizado. O script `build` da `apps/web` já roda `prisma generate` automaticamente; para desenvolvimento local, rode `npx prisma db push` antes do `pnpm dev`. Os testes Cypress inclusive ignoram explicitamente exceções não capturadas contendo `"prisma"` (`Cypress.on("uncaught:exception", ...)`) para não quebrar a suíte por causa disso.
* **Status 500 em `/financeiro` sem banco configurado:** a rota depende do Prisma; sem `DATABASE_URL` válida, retorna 500. O teste E2E dessa página usa `failOnStatusCode: false` para validar apenas a navegação, não a resposta do servidor.
* **Chat da Kauane sem `GROQ_API_KEY`:** a rota `/api/chat` falha se a variável não estiver definida, já que o cliente Groq é instanciado direto no topo do arquivo.

## 📂 Estrutura de Arquivos

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
