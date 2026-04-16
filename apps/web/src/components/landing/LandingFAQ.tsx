"use client"

import { useEffect, useRef, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "O que é a Dokei e como ela pode me ajudar?",
    answer:
      "A Dokei é uma plataforma de gestão completa criada especialmente para Microempreendedores Individuais (MEI). Com ela, você pode emitir recibos profissionais, controlar suas finanças, receber lembretes do DAS, calcular preços dos seus serviços e muito mais. Tudo de forma simples e intuitiva, sem precisar de conhecimento técnico.",
  },
  {
    question: "Preciso de cartão de crédito para usar o plano Free?",
    answer:
      "Não! O plano Free é totalmente gratuito e você não precisa cadastrar nenhum cartão de crédito para começar a usar. Basta criar sua conta e aproveitar os recursos disponíveis. Quando sentir necessidade, você pode fazer upgrade para um plano pago a qualquer momento.",
  },
  {
    question: "Posso cancelar minha assinatura a qualquer momento?",
    answer:
      "Sim, você pode cancelar sua assinatura quando quiser, sem multas ou taxas de cancelamento. Após o cancelamento, você continuará tendo acesso aos recursos premium até o final do período já pago. Depois disso, sua conta será convertida automaticamente para o plano Free.",
  },
  {
    question: "Os recibos emitidos pela Dokei têm validade legal?",
    answer:
      "Sim! Os recibos gerados pela Dokei seguem todas as normas e requisitos legais para comprovação de pagamento. Eles incluem todas as informações necessárias como dados do prestador (você), do cliente, valor, descrição do serviço e data. Você pode compartilhar diretamente pelo WhatsApp ou enviar por e-mail.",
  },
  {
    question: "Como funciona o lembrete do DAS?",
    answer:
      "O sistema envia notificações automáticas antes do vencimento do seu DAS (Documento de Arrecadação do Simples Nacional). Você recebe alertas por e-mail e/ou notificação push no app, garantindo que você nunca perca o prazo e evite multas e juros.",
  },
  {
    question: "Meus dados financeiros estão seguros?",
    answer:
      "Absolutamente! A segurança dos seus dados é nossa prioridade. Utilizamos criptografia de ponta a ponta, servidores seguros e seguimos rigorosos protocolos de proteção de dados conforme a LGPD. Seus dados nunca são compartilhados com terceiros sem sua autorização.",
  },
  {
    question: "Posso usar a Dokei no celular?",
    answer:
      "Sim! A Dokei é totalmente responsiva e funciona perfeitamente em qualquer dispositivo - seja no computador, tablet ou celular. Você pode acessar sua conta e gerenciar seu negócio de onde estiver, a qualquer momento.",
  },
  {
    question: "Como funciona a Calculadora de Preço?",
    answer:
      "Nossa Calculadora de Preço considera seus custos fixos, variáveis, tempo dedicado ao serviço e margem de lucro desejada para sugerir o preço ideal. Em apenas 30 segundos, você descobre quanto cobrar para ter lucro real sem perder competitividade no mercado.",
  },
]

export function LandingFAQ() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="faq" ref={sectionRef} className="py-20 lg:py-28 bg-[#f4f7f0]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block text-[#7ba23f] font-semibold text-sm uppercase tracking-wider mb-4">
            Dúvidas Frequentes
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1a4d2e] mb-6 text-balance">
            Perguntas que você pode ter
          </h2>
          <p className="text-lg text-[#4a6741] leading-relaxed">
            Reunimos as principais dúvidas para te ajudar a entender como a
            Dokei pode transformar a gestão do seu MEI.
          </p>
        </div>

        <div
          className={`max-w-3xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white border border-[#d4e5c7] rounded-xl px-6 data-[state=open]:shadow-md transition-shadow duration-300"
              >
                <AccordionTrigger className="text-left text-[#1a4d2e] font-semibold hover:text-[#7ba23f] hover:no-underline transition-colors py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#4a6741] pb-5 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div
          className={`text-center mt-12 transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-[#4a6741]">
            Ainda tem dúvidas?{" "}
            <a
              href="#"
              className="text-[#7ba23f] font-semibold hover:text-[#1a4d2e] transition-colors underline underline-offset-4"
            >
              Fale com nosso suporte
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
