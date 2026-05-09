export function normalizeCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "")
}

export function validateCnpj(cnpj: string): boolean {
  const n = normalizeCnpj(cnpj)
  if (n.length !== 14) return false
  if (/^(\d)\1+$/.test(n)) return false

  const calc = (digits: string, weights: number[]) =>
    digits
      .split("")
      .reduce((sum, d, i) => sum + Number(d) * (weights[i] ?? 0), 0)

  const r1 = calc(n.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) % 11
  const d1 = r1 < 2 ? 0 : 11 - r1

  const r2 = calc(n.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) % 11
  const d2 = r2 < 2 ? 0 : 11 - r2

  return Number(n[12]) === d1 && Number(n[13]) === d2
}
