# Arquitetura

Como a experiência "Um dia a 23°" funciona por dentro. O projeto é deliberadamente simples na stack (zero dependências) e sofisticado na execução.

---

## 1. Princípio central: o palco fixo

A tela que o visitante vê não muda — o que muda é o **cenário dentro dela**.

```
┌─────────────────────────────────────┐
│  .stage  (position: fixed, z-index 0)│  ← camada de vídeo, nunca rola
│   ├─ .scene[0]  hero                  │
│   ├─ .scene[1]  casa                  │
│   ├─ ...                              │  só 1–2 visíveis por vez (crossfade)
│   └─ .stage-tint (gradiente p/ texto) │
├─────────────────────────────────────┤
│  conteúdo (.chapter)  z-index 2       │  ← rola normalmente por cima
└─────────────────────────────────────┘
```

- `.stage` é `position: fixed; inset: 0; z-index: 0`. Os vídeos vivem aqui e nunca rolam.
- Os `.chapter` (texto) rolam normalmente acima, em `z-index: 2`.
- `.stage-tint` é um gradiente escuro fixo que garante legibilidade do texto sobre qualquer vídeo.

> **Gotcha crítico:** `html, body { overflow-x: clip }` — **nunca** `overflow-x: hidden`. `hidden` transforma o `body` em container de scroll e `window.scrollY` passa a retornar sempre 0, quebrando todo o motion silenciosamente.

---

## 2. O loop principal (`app.js`)

Tudo é dirigido pela posição de scroll, lido dentro de um `requestAnimationFrame` com *throttle*:

```
scroll → onScroll() → (rAF) → frame()
```

A cada `frame()`:

1. **Capítulo ativo** — calcula qual `.chapter` está no centro da viewport (`scrollY + vh*0.5`).
2. **Crossfade** — nos últimos 20% de cada capítulo (`t > 0.8`), a próxima cena entra com opacidade crescente enquanto a atual sai. O visitante nunca vê um corte.
3. **Parallax** — a cena ativa escala de `1.07 → 1.0` e desloca levemente em Y conforme o progresso, criando profundidade.
4. **HUD** — atualiza `hora · lugar` (com micro-animação de *swap*) ao trocar de capítulo. O `23°` nunca muda — é a promessa da marca.
5. **Barra da jornada** — preenche o trilho sol→lua proporcional ao scroll total.

> **Fallback de aba oculta:** `requestAnimationFrame` não dispara em abas ocultas/ocluídas. Por isso `onScroll()` checa `document.hidden` e chama `frame()` diretamente, mantendo o estado coerente em ferramentas de preview e pré-render.

---

## 3. Ciclo de vida dos vídeos (performance)

Vídeo é o ativo mais pesado. A regra: **no máximo 2 vídeos em memória**.

| Função | Papel |
|---|---|
| `ensure(i)` | Atribui `src` (de `data-src`) e `.load()` — só para cena anterior, atual e próxima |
| `playV(i)` / `pauseV(i)` | Toca a cena ativa, pausa as demais |
| `unload(i)` | Remove `src` e libera memória de qualquer cena a mais de 1 de distância |

- Os `<video>` têm `preload="none"` e o caminho real em `data-src` — nada carrega no boot.
- O **poster** (`<img fetchpriority="high">`) é o LCP; o vídeo da hero só carrega após `window.load`, via `requestIdleCallback`.
- `data-rate="0.7"` na cena final reduz a velocidade do vídeo reusado, escurecido por CSS (`.scene-night`).

---

## 4. Sistema de motion

| Efeito | Técnica | Regra |
|---|---|---|
| Crossfade de cena | `opacity` + classe `.on` | dispara em `t > 0.8` |
| Parallax | `transform: scale()/translateY()` | máx. 7% de escala, 3vh — `will-change` ativo |
| Reveals de texto | máscara `.ln{overflow:hidden}` + `.rv-ln{translateY}` | acionados por `.chapter.in` (IntersectionObserver) |
| Counters | `requestAnimationFrame` + easing cúbico | dispara a 60% de visibilidade |
| Botões magnéticos | `mousemove` → `transform` | só em `pointer: fine` |
| Mapa de rota (final) | SVG + `stroke-dasharray` + `offset-path` | loop infinito, ativado por `.in` |

**Regras absolutas:** animar apenas `transform` e `opacity` (nunca `width/height/margin`); easing padrão `cubic-bezier(.22,1,.36,1)`; tudo desligado sob `prefers-reduced-motion`.

### Mapa de rota do litoral

Na cena final, um SVG conecta Bombinhas → Porto Belo → Itapema com uma curva suave (desenho da costa). Um cometa de luz percorre a curva (`offset-path`), a linha se desenha (`stroke-dasharray`) e cada cidade "acende" com um pulso ao ser alcançada. Roda em loop e é puramente CSS — zero custo de JS. Sob `prefers-reduced-motion`, exibe a rota estática com as três cidades acesas.

---

## 5. Performance — decisões

- **1 request de CSS, 1 de JS.** O `main.css` é mantido como arquivo único de propósito: dividir em vários arquivos sem um bundler custaria requests HTTP e pioraria o carregamento.
- **Cache imutável** em `/assets/*` via `vercel.json` (`max-age=31536000, immutable`). Para forçar atualização de um asset alterado, suba a versão na query (`?v=N`) na referência em `index.html`.
- **Posters leves** (JPEG ~30–80 KB) seguram o LCP enquanto o vídeo carrega em segundo plano.
- **Fontes** com `preconnect` + `display=swap` evitam bloqueio de render.

---

## 6. Acessibilidade

- HUD, palco e barra de jornada são `aria-hidden` (decorativos).
- `prefers-reduced-motion`: desativa parallax, crossfade dinâmico e o mapa animado; mostra estados finais estáticos.
- Navegação por âncoras, foco visível nos controles, `alt` vazio em imagens puramente decorativas.
