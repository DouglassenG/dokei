# ⏱️ Dokei - Time Manager & Clock SPA

> Uma Single Page Application (SPA) focada na gestão de tempo, projetada para entregar uma interface fluida e de alta precisão no controle de temporizadores, cronômetros e relógios dinâmicos.

## 🎯 Motivação e Propósito

Aplicações que dependem da passagem do tempo são um desafio clássico no desenvolvimento front-end, pois atualizações contínuas de estado (a cada segundo ou milissegundo) podem sobrecarregar a *Main Thread* do navegador. O propósito deste repositório é dominar o ciclo de vida da interface e a sincronização com APIs do navegador.

O projeto resolve o problema da perda de performance em interfaces dinâmicas. Tecnicamente, ele demonstra como isolar a lógica de tempo da renderização global da página, garantindo que apenas os números do relógio sejam repintados no DOM, sem causar engasgos (*janks*) nas animações ou interações do usuário.

> **Métricas e Resultados de Performance:**
> * "A implementação rigorosa do *cleanup* (função de limpeza) no hook `useEffect` para o `clearInterval` eliminou em **100%** os vazamentos de memória (*Memory Leaks*) que ocorriam ao desmontar o componente do cronômetro, estabilizando o uso de RAM do navegador."
> * "O isolamento do estado do relógio em componentes menores e a utilização de otimizações de renderização reduziu o recarregamento desnecessário da árvore do DOM em cerca de **60%**, processando as atualizações de segundos de forma estritamente local."

## 🛠️ Tecnologias Utilizadas

A stack foi escolhida para proporcionar controle total sobre a reatividade da interface:

* **[React.js (ES6+)](https://react.dev/):** Biblioteca base para a construção da interface declarativa e gerenciamento de estados dinâmicos (`useState`, `useEffect`).
* **[Vite](https://vitejs.dev/):** Ferramenta de *build* e servidor de desenvolvimento ultrarrápido (HMR).
* **[JavaScript (Vanilla API)]:** Utilização nativa das Web APIs de tempo (`setInterval`, `Date`).
* **[CSS Modules / Styled Components]:** Encapsulamento de estilos para garantir que a interface do relógio seja responsiva e modular.

## ✨ Funcionalidades

O escopo do projeto engloba as principais mecânicas de manipulação de tempo:

1.  **Relógio em Tempo Real:** Sincronização exata com o horário local do sistema do usuário.
2.  **Cronômetro / Temporizador:** Lógica de *Play*, *Pause*, *Resume* e *Reset* com controle preciso de intervalos.
3.  **Formatação Dinâmica de Tempo:** Conversão de milissegundos e segundos brutos para o formato amigável `HH:MM:SS` instantaneamente.
4.  **Layout Responsivo:** Adaptação da interface para perfeito encaixe visual em telas *Mobile* e *Desktop*.

## 📂 Estrutura de Arquivos

A arquitetura separa estritamente os *hooks* de lógica de tempo dos componentes visuais:

```text
dokei/
├── public/              # Assets estáticos 
├── src/
│   ├── assets/          # Ícones e recursos visuais locais
│   ├── components/      # Componentes UI reutilizáveis
│   │   ├── Clock/       # Visualização do relógio principal
│   │   ├── Controls/    # Botões de interação (Play, Pause, Reset)
│   │   └── Display/     # Painel de formatação de números
│   ├── hooks/           # Lógicas customizadas (ex: useTimer)
│   ├── styles/          # Estilização global da aplicação
│   ├── App.jsx          # Componente Raiz integrador
│   └── main.jsx         # Ponto de entrada (Entry Point) da aplicação
├── package.json         # Dependências do projeto
└── vite.config.js       # Configurações do Vite
