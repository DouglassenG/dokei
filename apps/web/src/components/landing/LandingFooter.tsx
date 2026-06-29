interface FooterLink {
  label: string
  href: string
}

interface FooterSections {
  produto: FooterLink[]
  legal: FooterLink[]
}

const footerLinks: FooterSections = {
  produto: [
    { label: "Recursos", href: "#servicos" },
    { label: "FAQ", href: "#faq" },
  ],
  legal: [
    { label: "Termos de Uso", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "LGPD", href: "#" },
  ],
}

export function LandingFooter() {
  return (
    <footer className="bg-[#1a4d2e] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <a href="#" className="inline-block mb-6">
              <span className="text-2xl font-bold text-white">Dokei</span>
            </a>
            <p className="text-white/70 leading-relaxed mb-6 max-w-sm">
              Simplifique a gestão do seu MEI. Ferramentas simples para você
              focar no que realmente importa: fazer seu negócio crescer.
            </p>

            <div className="space-y-3">
              <a
                href="mailto:contato@dokei.com.br"
                className="block text-white/70 hover:text-white transition-colors"
              >
                <span>contato@dokei.com.br</span>
              </a>
              <div className="text-white/70">
                <span>São Paulo, Brasil</span>
              </div>
            </div>
          </div>

          {(Object.keys(footerLinks) as Array<keyof FooterSections>).map(
            (section) => (
              <div key={section}>
                <h4 className="font-semibold text-white mb-4 capitalize">
                  {section}
                </h4>
                <ul className="space-y-3">
                  {footerLinks[section].map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-white/60 text-sm text-center">
            © {new Date().getFullYear()} Dokei. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
