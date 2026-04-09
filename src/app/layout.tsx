import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
// Components hidden until launch
// import Topbar from "@/components/layout/Topbar";
// import Sidebar from "@/components/layout/Sidebar";
// import Footer from "@/components/layout/Footer";
// import { SidebarProvider } from "@/components/layout/SidebarContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulmaskbr.com'),
  title: {
    template: 'SoulmaskBR | %s',
    default: 'SoulmaskBR — Guia & Server List',
  },
  description: 'O guia completo de Soulmask em português — itens, máscaras, guias e patch notes',
  openGraph: {
    siteName: 'SoulmaskBR',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'SoulmaskBR — Guia & Server List',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${cinzel.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
