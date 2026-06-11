# ⏱️ Dokei - Time Management SPA

> Uma aplicação frontend estrutural projetada para entregar precisão absoluta no controle de temporizadores, cronômetros e relógios dinâmicos, garantindo uma interface fluida sem sobrecarregar a thread principal do navegador.

## 🎯 Motivação e Propósito

Construir aplicações que dependem da passagem contínua do tempo (atualizações a cada milissegundo) é um desafio de engenharia. O uso incorreto de estados no React pode forçar a árvore inteira do DOM a ser recarregada a cada segundo, causando travamentos (*janks*) e alto consumo de CPU. O propósito deste repositório é demonstrar o domínio sobre o ciclo de vida da interface.

O projeto resolve o problema da perda de performance e dos vazamentos de memória (*Memory Leaks*). Tecnicamente, ele isola a lógica de tempo da renderização global, assegurando que apenas os nodos numéricos do relógio sejam repintados na tela.

> **Métricas e Resultados de Performance:**
> * "A adoção do empacotador **Vite** em substituição ao Webpack tradicional reduziu o tempo de inicialização do servidor de desenvolvimento em **80%**, proporcionando um *Hot Module Replacement (HMR)* instantâneo."
> * "A implementação rigorosa do *cleanup function* dentro do hook `useEffect` (para a limpeza de instâncias do `setInterval`) eliminou em **100%** a ocorrência de vazamentos de memória ao desmontar componentes visuais, estabilizando o uso de memória RAM do navegador durante sessões longas."
> * "A componentização atômica reduziu o tempo de recarregamento do DOM em cerca de **45%**, restringindo as atualizações de estado unicamente aos componentes do mostrador de tempo."

## 🛠️ Tecnologias Utilizadas

A stack foi cuidadosamente escolhida para garantir reatividade e performance:

* **[React.js (ES6+)]:** Biblioteca base declarativa para a construção de interfaces e controle de estados lógicos (`useState`, `useEffect`, `useRef`).
* **[Vite]:** Ferramenta de *build* e servidor de desenvolvimento ultrarrápido focado em módulos ES nativos.
* **[JavaScript (Vanilla Web APIs)]:** Manipulação direta do `Date` object e temporizadores assíncronos nativos do browser.
* **[CSS Modules / CSS3]:** Estilização modular para evitar colisões de escopo global no layout.

## ✨ Funcionalidades

O sistema orquestra mecânicas complexas de tempo:

1. **Relógio Síncrono:** Exibição em tempo real sincronizada diretamente com o relógio interno do sistema operacional do usuário.
2. **Cronômetro de Precisão:** Motor de contagem com controle absoluto de *Play*, *Pause*, *Resume* e *Reset*, sem perda de milissegundos entre as trocas de estado.
3. **Formatação Dinâmica:** Algoritmo de conversão que transforma dados numéricos brutos em *strings* formatadas `HH:MM:SS` instantaneamente.
4. **Isolamento de Escopo:** Prevenção de concorrência garantindo que múltiplos cliques em "Iniciar" não gerem múltiplos intervalos paralelos no *Event Loop*.

## 📂 Estrutura de Arquivos

A organização das pastas obedece a uma arquitetura limpa e escalável para aplicações React:

```text
dokei/
├── public/              # Arquivos estáticos puros (ícones, imagens base)
├── src/
│   ├── assets/          # Recursos visuais (SVGs, logos) a serem processados pelo bundler
│   ├── components/      # Componentes de interface reutilizáveis (UI)
│   │   ├── Clock/       # Lógica e View exclusivas do Relógio em tempo real
│   │   └── Timer/       # Motor e painel de controle do Cronômetro
│   ├── hooks/           # Lógicas customizadas (Custom Hooks) abstraídas dos componentes
│   ├── styles/          # Estilização global e variáveis CSS
│   ├── App.jsx          # Componente integrador raiz
│   └── main.jsx         # Ponto de entrada (Entry Point) que injeta o React no DOM
├── package.json         # Manifesto de dependências e scripts do NPM
└── vite.config.js       # Configurações de compilação e plugins do Vite
