/**
 * Batch translator — converts all MDX files from English to pt-BR
 * and sets published: true.
 *
 * Usage: node scripts/translate-all.mjs
 */
import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// Section header translations
const HEADER_MAP = {
  'Description': 'Descrição',
  'Acquisition': 'Obtenção',
  'How to Obtain': 'Como Obter',
  'Location': 'Localização',
  'Locations': 'Localizações',
  'Found in': 'Encontrado em',
  'Crafting': 'Crafting',
  'Recipe': 'Receita',
  'Recipes': 'Receitas',
  'Usage': 'Uso',
  'Uses': 'Usos',
  'Used in': 'Usado em',
  'Stats': 'Atributos',
  'Statistics': 'Estatísticas',
  'Notes': 'Notas',
  'Trivia': 'Curiosidades',
  'Gallery': 'Galeria',
  'Media': 'Mídia',
  'Videos': 'Vídeos',
  'Tips': 'Dicas',
  'Strategy': 'Estratégia',
  'Strategies': 'Estratégias',
  'Combat': 'Combate',
  'Behavior': 'Comportamento',
  'Taming': 'Domesticação',
  'Breeding': 'Reprodução',
  'Drops': 'Drops',
  'Loot': 'Saque',
  'Damage': 'Dano',
  'Defense': 'Defesa',
  'Durability': 'Durabilidade',
  'Weight': 'Peso',
  'Set Bonus': 'Bônus do Conjunto',
  'Set bonus': 'Bônus do Conjunto',
  'Appearance': 'Aparência',
  'Overview': 'Visão Geral',
  'History': 'Histórico',
  'Patch History': 'Histórico de Patches',
  'Changelog': 'Registro de Mudanças',
  'See also': 'Veja também',
  'See Also': 'Veja Também',
  'References': 'Referências',
  'External links': 'Links Externos',
  'Mask Nodes': 'Nós da Máscara',
  'Mimicry Mode': 'Modo Mimetismo',
  'Passive Effect': 'Efeito Passivo',
  'Active Effect': 'Efeito Ativo',
  'Active Effect (V)': 'Efeito Ativo (V)',
  'Variants': 'Variantes',
  'Upgrades': 'Melhorias',
  'Requirements': 'Requisitos',
  'Materials': 'Materiais',
  'Ingredients': 'Ingredientes',
  'Components': 'Componentes',
  'Building': 'Construção',
  'Placement': 'Posicionamento',
  'Fuel': 'Combustível',
  'Production': 'Produção',
  'Output': 'Produto',
  'Input': 'Entrada',
  'Health': 'Vida',
  'Attack': 'Ataque',
  'Speed': 'Velocidade',
  'Range': 'Alcance',
  'Armor': 'Armadura',
  'Resistances': 'Resistências',
  'Weaknesses': 'Fraquezas',
  'Habitat': 'Habitat',
  'Diet': 'Dieta',
  'Spawn Locations': 'Locais de Spawn',
  'Features': 'Características',
  'Functions': 'Funções',
  'How to Use': 'Como Usar',
  'Repair': 'Reparo',
  'Repair Cost': 'Custo de Reparo',
  'Unlock': 'Desbloqueio',
  'Unlock Requirements': 'Requisitos de Desbloqueio',
  'Proficiency': 'Proficiência',
  'Proficiency Tree': 'Árvore de Proficiência',
  'Skills': 'Habilidades',
  'Skill Tree': 'Árvore de Habilidades',
  'Buffs': 'Buffs',
  'Effects': 'Efeitos',
  'Effect': 'Efeito',
  'Duration': 'Duração',
  'Cooldown': 'Tempo de Recarga',
  'Cost': 'Custo',
  'Resources': 'Recursos',
  'Resource': 'Recurso',
  'Items': 'Itens',
  'Weapons': 'Armas',
  'Tools': 'Ferramentas',
  'Food': 'Comida',
  'Creatures': 'Criaturas',
  'Enemies': 'Inimigos',
  'NPCs': 'NPCs',
  'Bosses': 'Chefes',
  'Maps': 'Mapas',
  'Furniture': 'Móveis',
  'Decorations': 'Decorações',
  'Storage': 'Armazenamento',
  'Containers': 'Contêineres',
}

// Common phrase translations (applied to body text)
const PHRASE_MAP = [
  // Item descriptions
  [/\bis an item in \*?Soulmask\*?\./gi, 'é um item em *Soulmask*.'],
  [/\bis a (?:type of )?weapon in \*?Soulmask\*?\./gi, 'é uma arma em *Soulmask*.'],
  [/\bis a (?:type of )?tool in \*?Soulmask\*?\./gi, 'é uma ferramenta em *Soulmask*.'],
  [/\bis a (?:type of )?shield in \*?Soulmask\*?\./gi, 'é um escudo em *Soulmask*.'],
  [/\bis a mask in \*?Soulmask\*?\./gi, 'é uma máscara em *Soulmask*.'],
  [/\bis a (?:type of )?armor (?:piece )?in \*?Soulmask\*?\./gi, 'é uma armadura em *Soulmask*.'],
  [/\bis a (?:type of )?building in \*?Soulmask\*?\./gi, 'é uma construção em *Soulmask*.'],
  [/\bis a (?:type of )?furniture (?:item )?in \*?Soulmask\*?\./gi, 'é um móvel em *Soulmask*.'],
  [/\bis a (?:type of )?creature in \*?Soulmask\*?\./gi, 'é uma criatura em *Soulmask*.'],
  [/\bis a (?:type of )?boss in \*?Soulmask\*?\./gi, 'é um chefe em *Soulmask*.'],
  [/\bis a (?:type of )?resource in \*?Soulmask\*?\./gi, 'é um recurso em *Soulmask*.'],
  [/\bis a (?:type of )?material in \*?Soulmask\*?\./gi, 'é um material em *Soulmask*.'],
  [/\bis a (?:type of )?food (?:item )?in \*?Soulmask\*?\./gi, 'é uma comida em *Soulmask*.'],
  [/\bis a (?:type of )?medicine in \*?Soulmask\*?\./gi, 'é um medicamento em *Soulmask*.'],
  [/\bis a (?:type of )?crystal in \*?Soulmask\*?\./gi, 'é um cristal em *Soulmask*.'],
  [/\bis a (?:type of )?mineral in \*?Soulmask\*?\./gi, 'é um mineral em *Soulmask*.'],
  [/\bis a (?:type of )?ammo(?:unition)? (?:type )?in \*?Soulmask\*?\./gi, 'é uma munição em *Soulmask*.'],
  [/\bis a location in \*?Soulmask\*?\./gi, 'é uma localização em *Soulmask*.'],
  [/\bis a workbench in \*?Soulmask\*?\./gi, 'é uma bancada de trabalho em *Soulmask*.'],
  [/\bis a crafting station in \*?Soulmask\*?\./gi, 'é uma estação de crafting em *Soulmask*.'],
  [/\bis a proficiency in \*?Soulmask\*?\./gi, 'é uma proficiência em *Soulmask*.'],
  [/\bis a mod(?:ification)? in \*?Soulmask\*?\./gi, 'é uma modificação em *Soulmask*.'],
  [/\bis a consumable in \*?Soulmask\*?\./gi, 'é um consumível em *Soulmask*.'],
  [/\bis a set of armor in \*?Soulmask\*?\./gi, 'é um conjunto de armadura em *Soulmask*.'],
  [/\bis an? equipment (?:set |piece )?in \*?Soulmask\*?\./gi, 'é um equipamento em *Soulmask*.'],

  // Common gameplay phrases
  [/\bCan be found in\b/gi, 'Pode ser encontrado em'],
  [/\bCan be obtained\b/gi, 'Pode ser obtido'],
  [/\bCan be crafted\b/gi, 'Pode ser fabricado'],
  [/\bCan be purchased\b/gi, 'Pode ser comprado'],
  [/\bCan be looted from\b/gi, 'Pode ser saqueado de'],
  [/\bDropped by\b/gi, 'Dropado por'],
  [/\bFound in\b/gi, 'Encontrado em'],
  [/\bObtained from\b/gi, 'Obtido de'],
  [/\bCrafted at\b/gi, 'Fabricado em'],
  [/\bCrafted with\b/gi, 'Fabricado com'],
  [/\bRequires\b/gi, 'Requer'],
  [/\bRequired materials\b/gi, 'Materiais necessários'],
  [/\bRequired level\b/gi, 'Nível necessário'],
  [/\bUnlocked at\b/gi, 'Desbloqueado em'],
  [/\bUnlocked by\b/gi, 'Desbloqueado por'],
  [/\bUsed to craft\b/gi, 'Usado para fabricar'],
  [/\bUsed to make\b/gi, 'Usado para fazer'],
  [/\bUsed for\b/gi, 'Usado para'],
  [/\bUsed in\b/gi, 'Usado em'],
  [/\bThis item\b/gi, 'Este item'],
  [/\bThis weapon\b/gi, 'Esta arma'],
  [/\bThis tool\b/gi, 'Esta ferramenta'],
  [/\bThis armor\b/gi, 'Esta armadura'],
  [/\bThis mask\b/gi, 'Esta máscara'],
  [/\bThis creature\b/gi, 'Esta criatura'],
  [/\bThis building\b/gi, 'Esta construção'],
  [/\bWhen equipped\b/gi, 'Quando equipado'],
  [/\bWhen used\b/gi, 'Quando usado'],
  [/\bWhen consumed\b/gi, 'Quando consumido'],
  [/\bWhen placed\b/gi, 'Quando posicionado'],
  [/\bWhen activated\b/gi, 'Quando ativado'],
  [/\bRestores (\d+) (?:HP|health|hit points)\b/gi, 'Restaura $1 de vida'],
  [/\bRestores (\d+) (?:stamina|SP)\b/gi, 'Restaura $1 de stamina'],
  [/\bDeals (\d+) damage\b/gi, 'Causa $1 de dano'],
  [/\bIncreases? (.+?) by (\d+)/gi, 'Aumenta $1 em $2'],
  [/\bDecreases? (.+?) by (\d+)/gi, 'Diminui $1 em $2'],
  [/\bper second\b/gi, 'por segundo'],
  [/\bfor (\d+) seconds?\b/gi, 'por $1 segundo(s)'],
  [/\bAncient Ruins\b/g, 'Ruínas Antigas'],
  [/\bHoly Ruins\b/g, 'Ruínas Sagradas'],
  [/\bDungeon\b/g, 'Masmorra'],
  [/\bSunstone/g, 'Pedra Solar'],
  [/\bYellow Crystal/g, 'Cristal Amarelo'],
  [/\bRed Crystal/g, 'Cristal Vermelho'],
  [/\bBlue Crystal/g, 'Cristal Azul'],
  [/\bGreen Crystal/g, 'Cristal Verde'],
  [/\bthe player\b/gi, 'o jogador'],
  [/\bThe player\b/g, 'O jogador'],
  [/\bplayers\b/gi, 'jogadores'],
  [/\benemy\b/gi, 'inimigo'],
  [/\benemies\b/gi, 'inimigos'],
  [/\bhealth points?\b/gi, 'pontos de vida'],
  [/\bexperience points?\b/gi, 'pontos de experiência'],
  [/\bhit points?\b/gi, 'pontos de vida'],
]

// Tags by category
const CATEGORY_TAGS = {
  'weapons': ['arma', 'combate', 'equipamento'],
  'armor': ['armadura', 'defesa', 'equipamento'],
  'shields': ['escudo', 'defesa', 'equipamento'],
  'tools': ['ferramenta', 'coleta'],
  'items': ['item', 'recurso'],
  'item-mods': ['modificação', 'equipamento', 'melhoria'],
  'crystals': ['cristal', 'recurso', 'raro'],
  'minerals': ['mineral', 'recurso', 'coleta'],
  'food': ['comida', 'consumível', 'buff'],
  'medicines': ['medicamento', 'consumível', 'cura'],
  'ammo': ['munição', 'combate', 'projétil'],
  'masks': ['máscara', 'habilidade', 'build'],
  'proficiencies': ['proficiência', 'habilidade', 'progressão'],
  'buildings': ['construção', 'base'],
  'furniture': ['móvel', 'decoração', 'base'],
  'workbenches': ['bancada', 'crafting', 'produção'],
  'creatures': ['criatura', 'animal', 'mundo'],
  'bosses': ['chefe', 'elite', 'combate'],
  'locations': ['localização', 'mapa', 'exploração'],
  'guides': ['guia', 'tutorial', 'dica'],
  'patches': ['patch', 'atualização'],
  'resources': ['recurso', 'material', 'coleta'],
}

// Tier by category
const CATEGORY_TIER = {
  'weapons': 'B', 'armor': 'B', 'shields': 'B', 'tools': 'B',
  'items': 'B', 'item-mods': 'B', 'crystals': 'B', 'minerals': 'B',
  'food': 'C', 'medicines': 'B', 'ammo': 'C',
  'masks': 'A', 'proficiencies': 'A',
  'buildings': 'C', 'furniture': 'C', 'workbenches': 'B',
  'creatures': 'B', 'bosses': 'A', 'locations': 'B',
  'guides': 'B', 'patches': 'B', 'resources': 'C',
}

function translateHeaders(text) {
  for (const [en, pt] of Object.entries(HEADER_MAP)) {
    // Match ## Header, ### Header, #### Header
    const escaped = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    text = text.replace(new RegExp(`^(#{2,4})\\s*${escaped}\\s*$`, 'gmi'), `$1 ${pt}`)
  }
  return text
}

function translatePhrases(text) {
  for (const [pattern, replacement] of PHRASE_MAP) {
    text = text.replace(pattern, replacement)
  }
  return text
}

function processFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8')

  // Split frontmatter and body
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return false

  let frontmatter = match[1]
  let body = match[2]

  // Skip already published files (already translated)
  if (frontmatter.includes('published: true')) return false

  // Set published: true
  frontmatter = frontmatter.replace('published: false', 'published: true')

  // Extract category from frontmatter
  const catMatch = frontmatter.match(/category:\s*"?([^"\n]+)"?/)
  const category = catMatch ? catMatch[1].trim() : 'items'

  // Add tags if not present
  if (!frontmatter.includes('tags:')) {
    const tags = CATEGORY_TAGS[category] || ['item']
    frontmatter += `\ntags: ${JSON.stringify(tags)}`
  }

  // Add tier if not present
  if (!frontmatter.includes('tier:')) {
    const tier = CATEGORY_TIER[category] || 'B'
    frontmatter += `\ntier: "${tier}"`
  }

  // Translate body
  body = translateHeaders(body)
  body = translatePhrases(body)

  // Write back
  fs.writeFileSync(filePath, `---\n${frontmatter}\n---\n${body}`, 'utf-8')
  return true
}

function main() {
  console.log('=== SoulmaskBR Batch Translator ===\n')

  let translated = 0
  let skipped = 0
  let failed = 0

  // Walk all content directories
  const categories = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const cat of categories) {
    const catDir = path.join(CONTENT_DIR, cat)
    const files = fs.readdirSync(catDir).filter(f => f.endsWith('.mdx'))

    let catTranslated = 0

    for (const file of files) {
      try {
        const result = processFile(path.join(catDir, file))
        if (result) {
          catTranslated++
          translated++
        } else {
          skipped++
        }
      } catch (err) {
        failed++
        console.error(`  ✗ ${cat}/${file}: ${err.message}`)
      }
    }

    if (catTranslated > 0) {
      console.log(`  [${cat}] ${catTranslated} translated, ${files.length - catTranslated} skipped`)
    }
  }

  console.log(`\n=== COMPLETE ===`)
  console.log(`Translated: ${translated}`)
  console.log(`Skipped: ${skipped} (already published)`)
  console.log(`Failed: ${failed}`)
}

main()
