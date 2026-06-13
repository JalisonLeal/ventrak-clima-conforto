<div align="center">

# VENTRAK · Clima e Conforto

### Site oficial — experiência cinematográfica premium focada em conversão

**"Um dia a 23°"** — uma jornada de scroll que atravessa um dia inteiro,
do amanhecer à madrugada, mostrando o conforto invisível da VENTRAK em cada ambiente.

`Performance` · `Conversão` · `Storytelling visual` · `Motion design` · `Zero dependências`

</div>

---

## ✦ Visão geral

Este não é um site de seções. É uma experiência contínua. O visitante "vive" um dia a 23°: a casa ao amanhecer, a sala, o quarto no calor do meio-dia, a escola à tarde, o comércio no fim do dia e a madrugada em que a máquina continua trabalhando. Os vídeos de fundo trocam em *crossfade* cinematográfico enquanto o conteúdo rola por cima, com um HUD que narra `hora · lugar · 23°`.

O objetivo de negócio é único e medível: **gerar leads pelo WhatsApp**.

| Prioridade | Como o projeto entrega |
|---|---|
| 1. Performance | Zero dependências, 1 CSS + 1 JS, vídeos *lazy* (máx. 2 em memória), poster LCP, cache imutável |
| 2. Conversão | CTA dominante de WhatsApp em cada ato, prova social com counters, foco em uma única ação |
| 3. Storytelling visual | Narrativa de 3 atos, 7 cenas em vídeo, jornada de um dia |
| 4. Motion design | Crossfade entre cenas, parallax de profundidade, reveals por máscara, mapa de rota animado |
| 5. Experiência premium | Tipografia editorial, glassmorphism sutil, botões magnéticos, HUD |
| 6. Manutenção | HTML semântico, CSS único e indexado, assets com nomes semânticos, docs completas |

---

## ✦ Stack

**Nenhum framework. Nenhuma biblioteca. Nenhum build step.**

- `HTML5` semântico
- `CSS3` — um único `main.css` (design system + animações), sem pré-processador
- `JavaScript` vanilla (ES2020) — `IntersectionObserver` + `requestAnimationFrame`, um único `app.js` (~7 KB)
- Fontes: Google Fonts (`Inter` + `Space Grotesk`) com `display=swap`

> **Por que zero dependência?** A versão anterior usava Three.js + GSAP + Lenis via CDN — e as animações falharam totalmente no ambiente do cliente (CDN bloqueado/lento). A regra agora é absoluta: nada de CDN de animação, nada que adicione um ponto único de falha. Tudo que o site precisa, ele carrega de si mesmo.

---

## ✦ Estrutura do repositório

```
ventrak-clima-conforto/
├── index.html                 # Página única — toda a experiência
├── vercel.json                # Cache imutável em /assets, clean URLs, security headers
├── robots.txt                 # SEO — libera crawl, aponta sitemap
├── sitemap.xml                # SEO — mapa do site
├── .gitignore
├── README.md                  # Este arquivo
├── docs/
│   ├── ARCHITECTURE.md         # Como o motor da experiência funciona
│   ├── DEPLOY.md               # Passo a passo de deploy (Vercel) e domínio
│   └── CONTENT-GUIDE.md        # Como editar textos, trocar vídeos, ajustar cenas
└── assets/
    ├── css/
    │   └── main.css            # Design system + experiência (arquivo único, indexado)
    ├── js/
    │   └── app.js              # Motor: crossfade, HUD, parallax, reveals, counters
    ├── brand/
    │   ├── favicon.svg
    │   └── og-image.jpg        # 1200×630 — compartilhamento social
    └── media/
        ├── video/              # Cenas em vídeo (loop, mudo, comprimido)
        │   ├── hero.mp4        # Evaporadora — exploded view
        │   ├── casa.mp4        # Casa ao amanhecer
        │   ├── sala.mp4        # Sala de estar
        │   ├── quarto.mp4      # Quarto, meio-dia
        │   ├── escola.mp4      # Escola, tarde
        │   └── comercio.mp4    # Comércio & empresas
        └── posters/            # Frame estático de cada cena (LCP / fallback)
            ├── hero.jpg  casa.jpg  sala.jpg
            └── quarto.jpg  escola.jpg  comercio.jpg
```

> A cena final (`23:59`) reusa `hero.mp4` escurecido e a 0.7× — fechamento narrativo que retoma a abertura.

---

## ✦ Rodar localmente

O site é 100% estático. Qualquer servidor de arquivos serve. Sem `npm install`.

```bash
# Python (já vem no macOS)
python3 -m http.server 4173

# abra http://localhost:4173
```

> Servir por HTTP (não abrir o arquivo via `file://`) é necessário para os vídeos e o `IntersectionObserver` funcionarem corretamente.

---

## ✦ Deploy

Hospedagem em **Vercel** (estático, sem build). Cada push na branch `main` publica produção; cada Pull Request gera um *Preview Deployment* automático.

Passo a passo completo — incluindo a migração do domínio `ventrak.com.br` — em **[docs/DEPLOY.md](docs/DEPLOY.md)**.

---

## ✦ Documentação técnica

- **[Arquitetura](docs/ARCHITECTURE.md)** — o motor da experiência, ciclo de vida dos vídeos, sistema de motion, performance.
- **[Deploy](docs/DEPLOY.md)** — Vercel, preview deployments, domínio, rollback.
- **[Guia de conteúdo](docs/CONTENT-GUIDE.md)** — editar textos, trocar vídeos, ajustar cores, adicionar cenas.

---

## ✦ Contato

**VENTRAK Clima e Conforto** — Bombinhas · Porto Belo · Itapema (SC)
WhatsApp: [(47) 99665-2365](https://wa.me/5547996652365) · contato@ventrak.com.br

<div align="center"><sub>Controle total. Conforto absoluto.</sub></div>
