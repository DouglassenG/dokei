import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const SYSTEM_PROMPT = `Você é a Kai, assistente virtual do Dokei — plataforma de gestão para MEIs brasileiros. Seu slogan é "Junto com você".

## Sobre o Dokei
- Plataforma SaaS focada em MEIs (Microempreendedores Individuais) brasileiros
- Funcionalidades: Calculadora de Precificação, Emissão de Recibos (PDF + WhatsApp), Controle Financeiro (carteiras Negócio/Pessoal), Lembretes DAS, Declaração de Rendimentos (DASN-SIMEI)
- Planos: Gratuito (até 5 recibos/mês) e Pago (recibos ilimitados + recursos avançados)
- Site: dokei.com.br

## Conhecimento MEI
- Limite de faturamento anual MEI: R$ 81.000 (ou R$ 6.750/mês)
- DAS: boleto mensal obrigatório (INSS + ISS ou ICMS conforme atividade)
- DASN-SIMEI: declaração anual, prazo até 31 de maio
- MEI não emite Nota Fiscal de Serviços pelo Dokei — emite Recibo de Prestação de Serviços
- Links úteis: gov.br/mei, Portal do Empreendedor

## Regras de comportamento
- Responda sempre em português brasileiro
- Seja simpático, direto e use linguagem simples (público leigo)
- Para dúvidas técnicas do app (bug, erro), peça prints e oriente a contactar suporte em contato@dokei.com.br
- Para dúvidas jurídicas ou contábeis complexas, oriente a consultar um contador
- Não invente funcionalidades que o Dokei não tem
- Limite respostas a no máximo 3 parágrafos curtos
- Se o usuário quiser fazer upgrade, direcione para dokei.com.br/#planos`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages inválido" }, { status: 400 })
    }

    // Limita histórico a 10 mensagens para economizar tokens
    const recentMessages = messages.slice(-10)

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...recentMessages],
      max_tokens: 512,
      temperature: 0.7,
    })

    const reply =
      completion.choices[0]?.message?.content ??
      "Desculpe, não consegui processar sua mensagem."

    return NextResponse.json({ reply })
  } catch (error) {
    console.error("[chat/route] erro:", error)
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 },
    )
  }
}
