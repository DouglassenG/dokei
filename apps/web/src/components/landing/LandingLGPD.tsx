"use client"

import { useEffect, useRef, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const lgpdItems = [
  {
    question: "Como coletamos seus dados",
    answer:
      "Coletamos apenas os dados necessários para o funcionamento da plataforma, como nome, e-mail, CNPJ e informações financeiras que você cadastra para emitir recibos e controlar suas finanças. Nenhum dado é coletado sem que você o tenha fornecido diretamente.",
  },
  {
    question: "Como usamos suas informações",
    answer:
      "Seus dados são utilizados exclusivamente para viabilizar as funcionalidades da Dokei, como geração de recibos, controle financeiro e envio de lembretes de obrigações fiscais. Não utilizamos seus dados para finalidades diferentes das que você autorizou.",
  },
  {
    question: "Seus direitos garantidos pela LGPD",
    answer:
      "Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a confirmar a existência de tratamento dos seus dados, acessá-los, corrigi-los, solicitar a anonimização, bloqueio ou eliminação de dados desnecessários, solicitar a portabilidade, revogar seu consentimento a qualquer momento e obter informações sobre com quem seus dados são compartilhados.",
  },
  {
    question: "Como solicitar acesso, correção ou exclusão dos seus dados",
    answer:
      "Você pode solicitar a qualquer momento o acesso, a correção ou a exclusão dos seus dados pessoais entrando em contato através do nosso canal de suporte. Atenderemos sua solicitação dentro dos prazos estabelecidos pela legislação vigente.",
  },
  {
    question: "Compartilhamento de dados com terceiros",
    answer:
      "Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins comerciais. Dados só são compartilhados com prestadores de serviço estritamente necessários para o funcionamento da plataforma (como infraestrutura e envio de e-mails), sempre respeitando a legislação de proteção de dados.",
  },
]

export function LandingLGPD() {
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
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#1a4d2e]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="inline-block text-[#7ba23f] font-semibold text-sm uppercase tracking-wider mb-4">
            LGPD
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Seus dados protegidos, sempre
          </h2>
          <p className="text-lg text-white/70 leading-relaxed drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)]">
            Levamos a proteção dos seus dados a sério. Veja como a Dokei
            segue a Lei Geral de Proteção de Dados (LGPD) para manter suas
            informações seguras.
          </p>
        </div>

        <div
          className={`max-w-3xl mx-auto transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {lgpdItems.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`lgpd-${index}`}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-6 data-[state=open]:bg-white/20 transition-colors duration-300"
              >
                <AccordionTrigger className="text-left text-white font-semibold hover:text-[#7ba23f] hover:no-underline transition-colors py-5">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 pb-5 leading-relaxed">
                  {item.answer}
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
          <p className="text-white/70">
            Tem dúvidas sobre seus dados?{" "}
            <a
              href="mailto:contato@dokei.com.br"
              className="text-[#7ba23f] font-semibold hover:text-white transition-colors underline underline-offset-4"
            >
              Fale com nosso suporte
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
