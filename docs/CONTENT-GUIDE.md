# Guia de conteúdo

Como manter o site sem quebrar a experiência. Tudo é editável em texto puro.

---

## Editar textos (títulos, parágrafos, CTAs)

Tudo vive em **`index.html`**, em blocos `<section class="chapter">`. Cada capítulo tem:

```html
<section class="chapter" data-scene="1" data-time="06:58" data-place="Casa" id="casa">
  <p class="ch-eyebrow"><span class="ch-clock">06:58</span> Casa</p>   <!-- rótulo -->
  <h2 class="ch-title">...</h2>                                        <!-- título -->
  <p class="ch-text">...</p>                                           <!-- parágrafo -->
  <a href="https://wa.me/55...">Orçar... →</a>                         <!-- CTA -->
</section>
```

- `data-time` e `data-place` alimentam o **HUD** (`hora · lugar · 23°`). Mantenha coerentes com a narrativa do dia.
- Títulos usam máscara de reveal: cada linha precisa estar em `<span class="ln"><span class="rv-ln">texto</span></span>`. A classe `accent` deixa a linha em ciano.

---

## Trocar o número de WhatsApp

O número aparece em vários links `https://wa.me/5547996652365?text=...`. Para trocar, faça **Localizar e Substituir** de `5547996652365` no `index.html`. O texto após `?text=` é a mensagem pré-preenchida (URL-encoded).

---

## Trocar um vídeo de cena

1. Gere/edite o vídeo (veja "Pipeline de mídia" abaixo).
2. Substitua o arquivo em `assets/media/video/` mantendo o **mesmo nome** (`casa.mp4`, `sala.mp4`, etc.) — assim nada no HTML precisa mudar.
3. Gere um novo **poster** correspondente em `assets/media/posters/` (mesmo nome, `.jpg`).
4. Se o nome mudar, atualize `data-src` (vídeo) e `src` (poster) na `.scene` correspondente em `index.html`.

Mapa cena → arquivo:

| `data-scene` | Capítulo | Vídeo | Poster |
|---|---|---|---|
| 0 | Hero | `hero.mp4` | `hero.jpg` |
| 1 | Casa | `casa.mp4` | `casa.jpg` |
| 2 | Sala | `sala.mp4` | `sala.jpg` |
| 3 | Quarto | `quarto.mp4` | `quarto.jpg` |
| 4 | Escola | `escola.mp4` | `escola.jpg` |
| 5 | Comércio | `comercio.mp4` | `comercio.jpg` |
| 6 | Final | `hero.mp4` (0.7×, escurecido) | `hero.jpg` |

---

## Pipeline de mídia (comprimir vídeo + gerar poster)

Vídeos precisam ser leves (alvo < 2 MB). Use `ffmpeg`:

```bash
# macOS sem brew: instalar ffmpeg via PyPI
python3 -m pip install --user imageio-ffmpeg
FFMPEG=$(python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")

# Comprimir (CRF 27, sem áudio, 1280px, streaming-ready)
"$FFMPEG" -i bruto.mp4 -c:v libx264 -crf 27 -preset veryslow \
  -vf "scale=1280:-2" -an -movflags +faststart \
  assets/media/video/casa.mp4

# Gerar poster (frame em 0.5s)
"$FFMPEG" -i assets/media/video/casa.mp4 -ss 0.5 -vframes 1 -q:v 2 \
  assets/media/posters/casa.jpg
```

> Vídeos brutos não comprimidos ficam fora do deploy (ver `media/raw/` no `.gitignore`).

---

## Ajustar cores / tipografia

No topo de **`assets/css/main.css`**, bloco `:root`:

```css
--navy-deep: #0B1623;   /* fundo */
--cyan: #00C5E8;        /* accent da marca */
--cyan-mist: #7ECFDF;
--ice: #E8F4F8;         /* texto claro */
--text-dim: #8FA8BC;    /* texto secundário */
--font-display: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
```

Trocar uma variável atualiza o site inteiro. Se mudar a família de fonte, atualize também o `<link>` do Google Fonts no `<head>` do `index.html`.

---

## Forçar atualização de cache de um asset

O cache de `/assets/*` é imutável (1 ano). Ao alterar `main.css` ou `app.js`, suba o número da versão na referência em `index.html`:

```html
<link rel="stylesheet" href="/assets/css/main.css?v=2">   <!-- era ?v=1 -->
<script defer src="/assets/js/app.js?v=2"></script>
```

---

## Atualizar a prova social (stats)

Na cena de Comércio (`id="loja"`), os números animados:

```html
<span data-count="500">0</span>+   <!-- instalações -->
<span data-count="98">0</span>%    <!-- satisfação -->
<span data-count="3">0</span>      <!-- cidades -->
```

Edite o `data-count`. Substitua por números reais assim que o cliente fornecer.
