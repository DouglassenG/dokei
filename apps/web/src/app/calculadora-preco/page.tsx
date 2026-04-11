"use client"

/**
 * Calculadora de Precificação — dokei
 *
 * Funcionalidades:
 * 1. Cálculo em tempo real com useMemo (Markup sobre Custo Total)
 * 2. URL compartilhável — parâmetros sincronizados com os campos
 */

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Clock,
  DollarSign,
  Percent,
  Plus,
  X,
  TrendingUp,
  AlertTriangle,
  Calculator,
  ArrowRight,
} from "lucide-react"

// ─── Tipagem ────────────────────────────────────────────────────────────────

interface CustoExtra {
  id: number
  nome: string
  valor: number
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function CalculadoraPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  /**
   * URL COMPARTILHÁVEL
   * Lê os parâmetros da URL ao carregar a página.
   * Se alguém abre o link compartilhado, os campos já vêm preenchidos.
   * Fallback para valores padrão se o parâmetro não existir.
   */
  const [custoPorHora, setCustoPorHora] = useState(
    Number(searchParams.get("hora") ?? 50),
  )
  const [horas, setHoras] = useState(Number(searchParams.get("horas") ?? 2))
  const [margem, setMargem] = useState(Number(searchParams.get("margem") ?? 30))
  const [custosExtras, setCustosExtras] = useState<CustoExtra[]>([])

  /**
   * Atualiza a URL sempre que custo/hora, horas ou margem mudam.
   * Não recarrega a página — apenas troca os parâmetros silenciosamente.
   */
  useEffect(() => {
    const params = new URLSearchParams()
    params.set("hora", String(custoPorHora))
    params.set("horas", String(horas))
    params.set("margem", String(margem))
    router.replace(`/calculadora-preco?${params.toString()}`, { scroll: false })
  }, [custoPorHora, horas, margem, router])

  // ─── Manipulação dos custos extras ────────────────────────────────────────

  function adicionarCusto() {
    setCustosExtras((prev) => [...prev, { id: Date.now(), nome: "", valor: 0 }])
  }

  function removerCusto(id: number) {
    setCustosExtras((prev) => prev.filter((c) => c.id !== id))
  }

  function atualizarCusto(id: number, campo: "nome" | "valor", valor: string) {
    setCustosExtras((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, [campo]: campo === "valor" ? Number(valor) : valor }
          : c,
      ),
    )
  }

  // ─── Cálculo em tempo real ────────────────────────────────────────────────

  /**
   * Método: Markup sobre Custo Total
   * precoMinimo = custoTotal ÷ (1 - margem ÷ 100)
   * precoMaximo = precoMinimo × 1,15
   */
  const resultado = useMemo(() => {
    const custoTempo = custoPorHora * horas
    const totalExtras = custosExtras.reduce((acc, c) => acc + c.valor, 0)
    const custoTotal = custoTempo + totalExtras
    const precoMinimo = custoTotal / (1 - margem / 100)
    const precoMaximo = precoMinimo * 1.15
    return { custoTotal, precoMinimo, precoMaximo }
  }, [custoPorHora, horas, margem, custosExtras])

  function formatBRL(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor)
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-[#1B5E20]"
        >
          <Calculator size={20} />
          dokei
        </Link>
        <Link
          href="/cadastro"
          className="flex items-center gap-2 text-sm text-white bg-[#1B5E20] hover:bg-[#145214] px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Começar grátis
          <ArrowRight size={16} />
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Quanto cobrar pelo meu serviço?
          </h1>
          <p className="text-gray-500">
            Descubra o preço justo em 30 segundos. Grátis.
          </p>
        </div>

        {/* Campos de entrada */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
          {/* Custo por hora */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <DollarSign size={16} />
              Quanto vale 1 hora do seu trabalho?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={10}
                max={500}
                step={5}
                value={custoPorHora}
                onChange={(e) => setCustoPorHora(Number(e.target.value))}
                className="cursor-pointer flex-1 accent-[#1B5E20]"
              />
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <span className="px-3 py-2 bg-gray-50 text-sm text-gray-500">
                  R$
                </span>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={custoPorHora}
                  onChange={(e) => setCustoPorHora(Number(e.target.value))}
                  className="w-20 px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Horas do serviço */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <Clock size={16} />
              Quantas horas vai levar o serviço?
            </label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              value={horas}
              onChange={(e) => setHoras(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20] hover:border-[#1B5E20]/40 transition-colors"
            />
          </div>

          {/* Custos extras */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <Plus size={16} />
              Custos extras (material, transporte...)
            </label>
            {custosExtras.map((custo) => (
              <div key={custo.id} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Material"
                  value={custo.nome}
                  onChange={(e) =>
                    atualizarCusto(custo.id, "nome", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                />
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <span className="px-2 py-2 bg-gray-50 text-sm text-gray-500">
                    R$
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={custo.valor}
                    onChange={(e) =>
                      atualizarCusto(custo.id, "valor", e.target.value)
                    }
                    className="w-24 px-2 py-2 text-sm focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => removerCusto(custo.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={adicionarCusto}
              className="flex items-center gap-1 text-sm text-[#1B5E20] hover:underline"
            >
              <Plus size={14} />
              Adicionar custo
            </button>
          </div>

          {/* Margem de lucro */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-[#1B5E20]">
              <Percent size={16} />
              Margem de lucro desejada:{" "}
              <span className="font-bold">{margem}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={150}
              step={5}
              value={margem}
              onChange={(e) => setMargem(Number(e.target.value))}
              className="cursor-pointer w-full accent-[#1B5E20]"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>10%</span>
              <span>150%</span>
            </div>
          </div>
        </div>

        {/* Resultado */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#1B5E20]" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Resultado
            </h2>
          </div>

          <div className="flex justify-between text-sm text-gray-500">
            <span>Custo total sem lucro</span>
            <span>{formatBRL(resultado.custoTotal)}</span>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-1">
            <p className="text-sm text-gray-500">Preço mínimo recomendado</p>
            <p className="text-4xl font-bold text-[#1B5E20]">
              {formatBRL(resultado.precoMinimo)}
            </p>
            <p className="text-sm text-gray-400">
              Faixa ideal: {formatBRL(resultado.precoMinimo)} até{" "}
              {formatBRL(resultado.precoMaximo)}
            </p>
          </div>

          {margem < 20 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle
                size={16}
                className="text-yellow-600 mt-0.5 shrink-0"
              />
              <p className="text-sm text-yellow-700">
                Margem abaixo de 20% pode não cobrir imprevistos.
              </p>
            </div>
          )}

          <p className="text-sm text-gray-400">
            Com {formatBRL(resultado.precoMinimo)} você cobre todos os custos e
            tem {margem}% de lucro.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-[#1B5E20]/5 rounded-2xl border border-[#1B5E20]/10 p-6 text-center space-y-4">
          <p className="text-sm font-medium text-gray-700">
            Gostou? Gere um orçamento profissional com esses valores.
          </p>
          <Link
            href="/cadastro"
            className="inline-flex items-center gap-2 bg-[#1B5E20] text-white hover:bg-[#145214] px-6 py-3 rounded-lg text-sm font-medium transition-colors"
          >
            Criar meu orçamento grátis
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  )
}
