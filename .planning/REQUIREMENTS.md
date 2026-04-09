# Requirements: SoulmaskBR

**Defined:** 2026-04-08
**Core Value:** Ser a referência central em português para jogadores de Soulmask — reunindo todo o conhecimento do jogo e conectando a comunidade através da server list.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Wiki / Conteúdo

- [x] **WIKI-01**: Usuário pode navegar pelo conteúdo organizado por categorias (itens/crafting, máscaras/skills, guias/tutoriais, patch notes)
- [x] **WIKI-02**: Usuário pode buscar conteúdo por texto livre com resultados relevantes
- [x] **WIKI-03**: Usuário pode acessar página individual de cada item com detalhes completos (stats, receitas, localização)
- [x] **WIKI-04**: Usuário pode acessar página individual de cada máscara com habilidades e builds
- [x] **WIKI-05**: Usuário pode ler patch notes e notícias traduzidas para pt-BR
- [x] **WIKI-06**: Todo conteúdo é original em pt-BR (reescrito da wiki oficial, não copiado)

### Server List

- [ ] **SRVL-01**: Usuário pode ver lista de servidores com filtros (mapa, modo, região, status online)
- [ ] **SRVL-02**: Usuário pode ver página de detalhes de cada servidor (banner, descrição, regras, IP, status, jogadores online)
- [ ] **SRVL-03**: Sistema verifica automaticamente se cada servidor está online via Steam Query Protocol (A2S_INFO)
- [ ] **SRVL-04**: Dono de servidor pode criar conta com email/senha
- [ ] **SRVL-05**: Dono de servidor pode cadastrar seu servidor (nome, IP, porta, descrição, banner)
- [ ] **SRVL-06**: Dono de servidor pode editar e gerenciar seus servidores no dashboard
- [ ] **SRVL-07**: Usuário pode votar em servidores (sistema de ranking mensal)

### Monetização

- [ ] **MONE-01**: Dono de servidor pode adquirir plano premium (destaque na lista, banner maior, posição privilegiada)
- [ ] **MONE-02**: Pagamento via PIX com Mercado Pago
- [ ] **MONE-03**: Diferentes tiers de premium com benefícios progressivos

### SEO / Performance

- [x] **SEO-01**: Cada página tem meta title, description e canonical URL únicos e otimizados para pt-BR
- [x] **SEO-02**: Sitemap.xml gerado automaticamente com todas as páginas
- [ ] **SEO-03**: Schema.org JSON-LD em páginas relevantes (VideoGame, HowTo, FAQPage, BreadcrumbList)
- [ ] **SEO-04**: Design responsivo mobile-first com boa performance (Core Web Vitals)

### Infraestrutura

- [x] **INFR-01**: Aplicação deployada na Vercel com CI/CD automático
- [x] **INFR-02**: Banco de dados Supabase com connection pooling (Supavisor)
- [x] **INFR-03**: Autenticação via Supabase Auth com RLS policies
- [x] **INFR-04**: Pipeline de scraping local (Cheerio) para extração estruturada da wiki oficial
- [x] **INFR-05**: Cron job externo (cron-job.org) para verificação periódica de status dos servidores

### Interface

- [x] **UI-01**: Interface 100% em português brasileiro
- [x] **UI-02**: Navegação clara com menu de categorias e busca acessível
- [x] **UI-03**: Tema visual adequado ao universo de Soulmask (survival/tribal)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Mapa Interativo

- **MAP-01**: Mapa interativo do mundo de Soulmask com imagem do jogo
- **MAP-02**: Filtros por tipo de marcador (recursos, NPCs/tribos, dungeons/bosses)
- **MAP-03**: Usuário pode aplicar múltiplos filtros simultaneamente
- **MAP-04**: Marcações custom do usuário (salvas no browser)

### Server List Avançado

- **SRVL-08**: Banner embeddável com player count ao vivo (para donos usarem em Discord/sites)
- **SRVL-09**: Histórico de uptime e player count por servidor

### Conteúdo Avançado

- **WIKI-07**: Calculadoras interativas (dano, crafting, etc)
- **WIKI-08**: Comparador de itens/máscaras lado a lado

## Out of Scope

| Feature | Reason |
|---------|--------|
| Conta/perfil para visitantes comuns | Simplifica v1 — apenas donos de servidor precisam de conta |
| Chat/fórum integrado | Foco em conteúdo e server list, não rede social |
| App mobile nativo | Web responsivo é suficiente |
| Edição colaborativa (wiki aberta) | Conteúdo gerenciado pela equipe, não pelos usuários |
| Conteúdo em outros idiomas | Foco exclusivo em português |
| Login com OAuth (Google, Discord) | Email/senha suficiente para v1 |
| Tradução automática com IA | Conteúdo deve ser reescrito manualmente para qualidade e SEO |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Complete |
| INFR-04 | Phase 1 | Complete |
| INFR-05 | Phase 1 | Complete |
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 1 | Complete |
| WIKI-01 | Phase 2 | Complete |
| WIKI-02 | Phase 2 | Complete |
| WIKI-03 | Phase 2 | Complete |
| WIKI-04 | Phase 2 | Complete |
| WIKI-05 | Phase 2 | Complete |
| WIKI-06 | Phase 2 | Complete |
| SEO-01 | Phase 3 | Complete |
| SEO-02 | Phase 3 | Complete |
| SEO-03 | Phase 3 | Pending |
| SEO-04 | Phase 3 | Pending |
| SRVL-01 | Phase 4 | Pending |
| SRVL-02 | Phase 4 | Pending |
| SRVL-03 | Phase 4 | Pending |
| SRVL-07 | Phase 4 | Pending |
| SRVL-04 | Phase 5 | Pending |
| SRVL-05 | Phase 5 | Pending |
| SRVL-06 | Phase 5 | Pending |
| MONE-01 | Phase 6 | Pending |
| MONE-02 | Phase 6 | Pending |
| MONE-03 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-08*
*Last updated: 2026-04-08 after roadmap creation*
