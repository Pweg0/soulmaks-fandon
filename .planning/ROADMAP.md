# Roadmap: SoulmaskBR — Guia & Server List

**Created:** 2026-04-08
**Milestone:** v1
**Granularity:** Standard
**Coverage:** 28/28 requirements mapped

## Phases

- [x] **Phase 1: Fundacao** - Stack configurado, banco de dados, auth e pipeline de scraping prontos para uso (completed 2026-04-09)
- [ ] **Phase 2: Wiki & Conteudo** - Conteudo navegavel em pt-BR com busca, paginas individuais e patch notes
- [ ] **Phase 3: SEO & Performance** - Site otimizado para buscadores brasileiros com Core Web Vitals aprovados
- [ ] **Phase 4: Server List — Consulta** - Qualquer visitante pode explorar, filtrar e votar em servidores listados
- [ ] **Phase 5: Server List — Cadastro** - Donos de servidor podem criar conta, cadastrar e gerenciar seus servidores
- [ ] **Phase 6: Monetizacao Premium** - Donos de servidor podem adquirir planos premium e pagar via PIX

## Phase Details

### Phase 1: Fundacao
**Goal**: Infraestrutura completa funcionando — deploy automatico, banco de dados, autenticacao e pipeline de scraping prontos para suportar todas as fases seguintes
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04, INFR-05, UI-01, UI-02, UI-03
**Success Criteria** (what must be TRUE):
  1. Um push para o repositorio principal dispara deploy automatico na Vercel e o site fica acessivel publicamente
  2. O banco de dados Supabase aceita conexoes via Supavisor (pooler) e as RLS policies bloqueiam acesso nao autorizado
  3. O script de scraping local extrai conteudo estruturado da wiki oficial e armazena no banco sem erros
  4. O cron externo (cron-job.org) chama o endpoint de verificacao de servidores e a resposta e registrada no log
  5. A interface exibe menus de navegacao, busca acessivel e tema visual survival/tribal — tudo escrito em portugues brasileiro
**Plans:** 4/4 plans complete

Plans:
- [x] 01-01-PLAN.md — Bootstrap Next.js 16 + Supabase clients + auth middleware + Vitest
- [x] 01-02-PLAN.md — Dark tribal theme + layout shell + homepage (topbar, sidebar, footer, hero, cards)
- [x] 01-03-PLAN.md — Scraping pipeline (Fandom + wiki.gg) with MDX output
- [x] 01-04-PLAN.md — Cron endpoint for server status verification via TCP ping

**UI hint**: yes

### Phase 2: Wiki & Conteudo
**Goal**: Visitante encontra e le todo o conteudo do jogo em portugues — categorias, itens, mascaras, guias e patch notes
**Depends on**: Phase 1
**Requirements**: WIKI-01, WIKI-02, WIKI-03, WIKI-04, WIKI-05, WIKI-06
**Success Criteria** (what must be TRUE):
  1. Visitante acessa a pagina inicial e ve categorias distintas (itens/crafting, mascaras/skills, guias/tutoriais, patch notes) com conteudo listado em cada uma
  2. Visitante digita um termo na busca e recebe uma lista de resultados relevantes que levam a paginas corretas
  3. Visitante acessa a pagina de um item e ve stats, receita de crafting e localizacao de obtencao — tudo em pt-BR
  4. Visitante acessa a pagina de uma mascara e ve habilidades, builds recomendados e descricao — tudo em pt-BR
  5. Visitante acessa a secao de patch notes e le a traducao da ultima atualizacao do jogo
**Plans:** 4 plans

Plans:
- [x] 02-01-PLAN.md — Content foundation: types, MDX utilities, scraper enhancement, shadcn components
- [ ] 02-02-PLAN.md — Category listing pages with filter bar, grid/table toggle, pagination
- [ ] 02-03-PLAN.md — Item and mask detail pages with card expansivo and accordion sections
- [ ] 02-04-PLAN.md — Pagefind search integration + patch notes pages + visual verification

**UI hint**: yes

### Phase 3: SEO & Performance
**Goal**: Cada pagina do site e indexavel de forma otima por buscadores e carrega rapidamente em dispositivos moveis
**Depends on**: Phase 2
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. Cada pagina de conteudo exibe um meta title e description unicos e relevantes ao conteudo da pagina ao inspecionar o HTML
  2. O arquivo sitemap.xml esta acessivel e lista todas as paginas publicas do site com URLs canonicas corretas
  3. Paginas de itens e guias exibem JSON-LD valido (VideoGame, HowTo ou FAQPage) ao testar no Rich Results Test do Google
  4. O site atinge pontuacao verde no PageSpeed Insights Mobile (Core Web Vitals aprovados) em paginas de wiki
**Plans**: TBD

### Phase 4: Server List — Consulta
**Goal**: Qualquer visitante pode descobrir servidores de Soulmask, filtrar por criterios e ver status em tempo real sem precisar de conta
**Depends on**: Phase 1
**Requirements**: SRVL-01, SRVL-02, SRVL-03, SRVL-07
**Success Criteria** (what must be TRUE):
  1. Visitante acessa a server list e ve servidores com indicador visual de online/offline atualizado automaticamente pelo sistema
  2. Visitante aplica filtros (mapa, modo de jogo, regiao) e a lista atualiza para mostrar apenas servidores correspondentes
  3. Visitante clica em um servidor e ve pagina com banner, descricao, regras, IP, status atual e numero de jogadores online
  4. Visitante vota em um servidor favorito e o ranking mensal reflete o voto imediatamente
**Plans**: TBD
**UI hint**: yes

### Phase 5: Server List — Cadastro
**Goal**: Donos de servidor podem criar conta, cadastrar seu servidor e gerenciar informacoes atraves de um dashboard proprio
**Depends on**: Phase 4
**Requirements**: SRVL-04, SRVL-05, SRVL-06
**Success Criteria** (what must be TRUE):
  1. Dono de servidor cria conta com email e senha e recebe acesso ao dashboard sem intervencao manual
  2. Dono de servidor preenche o formulario de cadastro de servidor (nome, IP, porta, descricao, banner) e o servidor aparece na server list apos verificacao de IP
  3. Dono de servidor acessa o dashboard, edita a descricao do servidor e ve a mudanca refletida na pagina publica em menos de 1 minuto
**Plans**: TBD
**UI hint**: yes

### Phase 6: Monetizacao Premium
**Goal**: Donos de servidor podem adquirir planos premium, pagar via PIX e ter seus servidores destacados na lista com beneficios visiveis
**Depends on**: Phase 5
**Requirements**: MONE-01, MONE-02, MONE-03
**Success Criteria** (what must be TRUE):
  1. Dono de servidor ve a pagina de planos com pelo menos dois tiers distintos e beneficios claros de cada um (destaque, banner maior, posicao privilegiada)
  2. Dono de servidor seleciona um plano, conclui pagamento via PIX pelo Mercado Pago e o servidor recebe o destaque na lista automaticamente apos confirmacao do pagamento
  3. Servidor premium aparece acima dos servidores gratuitos na listagem e exibe badge ou indicador visual de destaque para visitantes
**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Fundacao | 4/4 | Complete   | 2026-04-09 |
| 2. Wiki & Conteudo | 0/4 | Planning complete | - |
| 3. SEO & Performance | 0/? | Not started | - |
| 4. Server List — Consulta | 0/? | Not started | - |
| 5. Server List — Cadastro | 0/? | Not started | - |
| 6. Monetizacao Premium | 0/? | Not started | - |

---
*Roadmap created: 2026-04-08*
*Last updated: 2026-04-09 after Phase 2 planning*
