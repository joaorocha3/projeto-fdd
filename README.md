# Orçamentos Express

Gerador de orçamentos numa única página, pensado para técnicos (canalizadores,
pintores, empreiteiros) que precisam de criar e enviar um orçamento formal em
PDF pelo WhatsApp em menos de um minuto, a partir do telemóvel.

## Funcionalidades

- Ecrã único, mobile-first, sem login e sem base de dados.
- Cabeçalho da empresa editável (nome, telefone, logótipo).
- Dados do cliente (nome e morada/obra opcional).
- Linhas de orçamento com cálculo automático do total por linha e do total geral.
- Rodapé fixo com validade do orçamento (30 dias) e IBAN.
- Botão gigante "Gerar PDF e Partilhar" que gera um PDF profissional e abre o
  menu de partilha nativo do telemóvel (Web Share API) para envio direto pelo
  WhatsApp — com fallback para descarregar o ficheiro em navegadores sem
  suporte.
- Estado guardado automaticamente no `localStorage` do navegador (nada é
  enviado para um servidor).

## Stack

- [Vite](https://vite.dev) + React + TypeScript
- Tailwind CSS v4
- [jsPDF](https://github.com/parallax/jsPDF) + jspdf-autotable para a geração do PDF

## Desenvolvimento

```bash
npm install
npm run dev
```

```bash
npm run build   # build de produção
npm run lint    # oxlint
```
