import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"

/**
 * Componente do PDF do recibo
 * Gerado no servidor via @react-pdf/renderer
 * Layout profissional para MEI
 */

interface DadosRecibo {
  nomeCliente: string
  servicoDescricao: string
  valor: number
  formaPagamento: string
  data: string
  observacoes?: string
}

interface ReciboPDFProps {
  numero: string
  dados: DadosRecibo
  nomePrestador: string
  plano: string
}

// Estilos do PDF — separados do JSX para clareza
const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  logo: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1B5E20",
  },
  numeroRecibo: {
    fontSize: 11,
    color: "#6b7280",
    textAlign: "right",
  },
  numeroReciboDestaque: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1B5E20",
    textAlign: "right",
  },

  // Seções
  secao: {
    marginBottom: 24,
  },
  secaoTitulo: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },

  // Linhas de dado
  linha: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    width: 140,
  },
  valor: {
    fontSize: 10,
    color: "#111827",
    flex: 1,
  },

  // Valor em destaque
  valorDestaque: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#1B5E20",
    marginTop: 4,
  },

  // Divisor
  divisor: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 24,
  },

  // Assinatura
  assinaturaContainer: {
    marginTop: 48,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  assinaturaLinha: {
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    width: 200,
    paddingTop: 8,
  },
  assinaturaLabel: {
    fontSize: 9,
    color: "#6b7280",
  },

  // Rodapé
  rodape: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rodapeTexto: {
    fontSize: 8,
    color: "#9ca3af",
  },
  rodapeDestaque: {
    fontSize: 8,
    color: "#1B5E20",
  },

  // Marca d'água plano grátis
  marcaDagua: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 40,
    color: "#f3f4f6",
    fontFamily: "Helvetica-Bold",
    transform: "rotate(-45deg)",
  },
})

// Formata valor para BRL sem usar Intl (não disponível no react-pdf)
function formatBRL(valor: number): string {
  const valorFixo = valor.toFixed(2)
  // Separa parte inteira e decimal com segurança
  const [inteira = "0", decimal = "00"] = valorFixo.split(".")
  // Adiciona pontos como separador de milhar na parte inteira
  const inteiraFormatada = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `R$ ${inteiraFormatada},${decimal}`
}

// Formata data de YYYY-MM-DD para DD/MM/YYYY
function formatData(data: string): string {
  const [ano, mes, dia] = data.split("-")
  return `${dia}/${mes}/${ano}`
}

export function ReciboPDF({
  numero,
  dados,
  nomePrestador,
  plano,
}: ReciboPDFProps) {
  const ehPlanoGratis = plano === "gratis"

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Marca d'água no plano grátis */}
        {ehPlanoGratis && <Text style={styles.marcaDagua}>dokei.com.br</Text>}

        {/* Header — logo + número do recibo */}
        <View style={styles.header}>
          <Text style={styles.logo}>dokei</Text>
          <View>
            <Text style={styles.numeroRecibo}>Recibo</Text>
            <Text style={styles.numeroReciboDestaque}>{numero}</Text>
          </View>
        </View>

        {/* Dados do prestador */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Prestador de Serviço</Text>
          <View style={styles.linha}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.valor}>{nomePrestador}</Text>
          </View>
        </View>

        <View style={styles.divisor} />

        {/* Dados do cliente */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Cliente</Text>
          <View style={styles.linha}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.valor}>{dados.nomeCliente}</Text>
          </View>
        </View>

        <View style={styles.divisor} />

        {/* Dados do serviço */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Serviço</Text>
          <View style={styles.linha}>
            <Text style={styles.label}>Descrição</Text>
            <Text style={styles.valor}>{dados.servicoDescricao}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.valor}>{formatData(dados.data)}</Text>
          </View>
          {dados.observacoes ? (
            <View style={styles.linha}>
              <Text style={styles.label}>Observações</Text>
              <Text style={styles.valor}>{dados.observacoes}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.divisor} />

        {/* Valor */}
        <View style={styles.secao}>
          <Text style={styles.secaoTitulo}>Pagamento</Text>
          <View style={styles.linha}>
            <Text style={styles.label}>Forma de pagamento</Text>
            <Text style={styles.valor}>{dados.formaPagamento}</Text>
          </View>
          <Text style={styles.valorDestaque}>{formatBRL(dados.valor)}</Text>
        </View>

        {/* Linha de assinatura */}
        <View style={styles.assinaturaContainer}>
          <View style={styles.assinaturaLinha}>
            <Text style={styles.assinaturaLabel}>Assinatura do prestador</Text>
          </View>
          <View style={styles.assinaturaLinha}>
            <Text style={styles.assinaturaLabel}>Assinatura do cliente</Text>
          </View>
        </View>

        {/* Rodapé */}
        <View style={styles.rodape}>
          <Text style={styles.rodapeTexto}>
            Emitido em {formatData(dados.data)} via{" "}
            <Text style={styles.rodapeDestaque}>dokei.com.br</Text>
          </Text>
          <Text style={styles.rodapeTexto}>{numero}</Text>
        </View>
      </Page>
    </Document>
  )
}
