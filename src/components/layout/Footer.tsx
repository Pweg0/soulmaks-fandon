export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-6 px-6">
      <div className="mx-auto max-w-[1280px] flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
        <p>&copy; 2026 SoulmaskBR. Todos os direitos reservados.</p>
        <a
          href="mailto:contato@soulmaskbr.com.br"
          className="hover:text-foreground transition-colors duration-150"
        >
          Contato
        </a>
      </div>
    </footer>
  )
}
