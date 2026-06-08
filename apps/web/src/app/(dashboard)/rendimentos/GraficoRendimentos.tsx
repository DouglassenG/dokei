"use client"

/**
 * GraficoRendimentos — Client Component
 *
 * Gráfico de barras agrupado com Recharts.
 * Exibe entradas (verde) e saídas (vermelho) por mês do ano.
 * Separado como Client Component pois Recharts precisa do browser.
 *
 * Recharts usa cores inline em SVG — não responde a CSS variables.
 * Por isso usa useTheme() para detectar dark mode e adaptar as cores.
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface MesData {
  mes: number
  nomeMes: string
  entradas: number
  saidas: number
  saldo: number
}

interface GraficoRendimentosProps {
  meses: MesData[]
}

// Formata valor para BRL no tooltip
function formatBRL(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor)
}

// Tooltip customizado para exibir valores em BRL
function TooltipCustomizado({
  active,
  payload,
  label,
  escuro,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
  escuro?: boolean
}) {
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        backgroundColor: escuro ? "#132117" : "#ffffff",
        border: `1px solid ${escuro ? "#243d28" : "#e5e7eb"}`,
        borderRadius: "0.75rem",
        padding: "0.75rem",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 600,
          color: escuro ? "#e4ede6" : "#374151",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </p>
      {payload.map((entry) => (
        <p
          key={entry.name}
          style={{
            fontSize: "0.75rem",
            color: entry.color,
          }}
        >
          {entry.name}: {formatBRL(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function GraficoRendimentos({ meses }: GraficoRendimentosProps) {
  const { theme, systemTheme } = useTheme()
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    setMontado(true)
  }, [])

  // Resolve o tema real (system pode ser light ou dark)
  const temaAtual = theme === "system" ? systemTheme : theme
  const escuro = montado && temaAtual === "dark"

  // Cores adaptativas para SVG inline do Recharts
  const corGrid = escuro ? "#243d28" : "#f3f4f6"
  const corTextoEixo = escuro ? "#8a9f8e" : "#9ca3af"

  // Abrevia o nome do mês para 3 letras no eixo X
  const dados = meses.map((m) => ({
    ...m,
    nomeMes: m.nomeMes.slice(0, 3),
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={dados}
        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        barSize={10}
        barGap={2}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={corGrid}
          vertical={false}
        />
        <XAxis
          dataKey="nomeMes"
          tick={{ fontSize: 11, fill: corTextoEixo }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: corTextoEixo }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          width={32}
        />
        <Tooltip
          content={<TooltipCustomizado escuro={escuro} />}
          wrapperStyle={{ outline: "none", border: "none", background: "none" }}
          cursor={{
            fill: escuro ? "rgba(139,195,74,0.08)" : "rgba(0,0,0,0.04)",
          }}
        />
        <Legend
          formatter={(value) => (
            <span className="text-xs text-muted-foreground">{value}</span>
          )}
        />
        <Bar
          dataKey="entradas"
          name="Entradas"
          fill="#22c55e"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="saidas"
          name="Saídas"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
