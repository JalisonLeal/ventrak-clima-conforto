# Deploy

Site estático, hospedado na **Vercel**. Sem build step, sem variáveis de ambiente, sem backend.

---

## Dependências

Nenhuma de runtime. Para deploy você só precisa de:

- Uma conta **GitHub** (repositório `ventrak-clima-conforto`)
- Uma conta **Vercel** (plano Hobby já atende)

Opcional, para trabalho local de mídia:
- `ffmpeg` (via `imageio-ffmpeg` do PyPI no macOS sem brew) — comprimir vídeos e gerar posters. Veja [CONTENT-GUIDE.md](CONTENT-GUIDE.md).

---

## Primeiro deploy (conectar GitHub → Vercel)

1. Acesse **[vercel.com/new](https://vercel.com/new)** e faça login com o GitHub.
2. **Import** o repositório `ventrak-clima-conforto`.
3. Configurações de projeto:
   - **Framework Preset:** `Other` (estático)
   - **Build Command:** *(vazio)*
   - **Output Directory:** *(vazio — serve a raiz)*
   - **Install Command:** *(vazio)*
4. **Deploy.** Em segundos a Vercel publica uma URL `*.vercel.app`.

A partir daí:
- **Produção** = todo push na branch `main`.
- **Preview Deployment** = toda Pull Request ganha uma URL própria de pré-visualização, automaticamente.

> O `vercel.json` já define cache imutável para `/assets/*`, *clean URLs* e *security headers*. Nada a configurar manualmente.

---

## Verificar build e performance

1. Abra a URL de preview e role a experiência inteira.
2. Confira no DevTools → Network: 1 CSS, 1 JS, vídeos carregando sob demanda.
3. Rode o **Lighthouse** (DevTools → Lighthouse, modo Mobile) ou o **[PageSpeed Insights](https://pagespeed.web.dev/)** na URL pública. Meta: Performance **95+**.

---

## Domínio — `ventrak.com.br`

> ⚠️ **Não alterar DNS sem aprovação.** O domínio hoje aponta para o site antigo. A troca derruba o site atual.

Quando aprovado:

1. No projeto Vercel → **Settings → Domains** → adicione `ventrak.com.br` e `www.ventrak.com.br`.
2. A Vercel mostra os registros a configurar no provedor de DNS:
   - Apex (`ventrak.com.br`) → registro **A** para o IP indicado pela Vercel **ou** `ALIAS/ANAME` para `cname.vercel-dns.com`.
   - `www` → **CNAME** para `cname.vercel-dns.com`.
3. Aplique no painel de DNS do registrador.
4. Aguarde a propagação (minutos a algumas horas). A Vercel emite o certificado SSL automaticamente.
5. Defina o redirect canônico (recomendado: `www` → apex, ou o inverso, conforme preferência).

---

## Rollback

- **Repositório antigo** (Three.js) preservado como histórico — não é tocado por este projeto.
- Na Vercel, qualquer deploy anterior pode ser promovido a produção em 1 clique (**Deployments → ⋯ → Promote to Production**).
- Como o domínio só muda quando aprovado, o site atual permanece no ar durante toda a validação do novo.
