# Audit de l'existant — alephbeth.ai

> Lot L1 de la spec « Évolution de alephbeth.ai : du blog au site commercial ».
> Audit réalisé le 13/10/2026, sans aucune modification du site ni des dépôts.
> Statut : **à valider** avant le lot L2.

---

## 0. Constat préalable : deux dépôts, deux sites

Le domaine **www.alephbeth.ai** est servi par une application React, alors que le blog d'origine est un site Hugo maintenu en parallèle dans un autre dépôt. Il existe deux dépôts publics, sans lien de fork entre eux, qui partagent le même contenu éditorial mais pas le même générateur :

| | Dépôt A (compte personnel) | Dépôt B (organisation) |
|---|---|---|
| Dépôt | `aleph-beth/AI-Watchtower` | `alephbeth-ai/AI-Watchtower` |
| Générateur | **Hugo 0.146.0** (extended), thème **PaperMod** (sous-module git, commit du 26/04/2026) | **React 18 + Vite 6 + Tailwind 3** (SPA) avec pré-rendu maison (`scripts/postbuild.mjs`) |
| URL servie | https://aleph-beth.github.io/AI-Watchtower/ | **https://www.alephbeth.ai** (domaine vérifié, HTTPS forcé) |
| Déploiement | `.github/workflows/hugo.yml` → GitHub Pages (type « workflow ») | `.github/workflows/deploy.yml` → GitHub Pages (type « workflow ») |
| Identité visuelle | Charte AlephBeth (bleu nuit / braise / flamme, Instrument Serif + Geist, emblème arbre-bouclier) | Style « cyber » (cyan / teal, ombres lumineuses, Plus Jakarta Sans + JetBrains Mono, logo JPEG) |
| Articles | 11 paires FR/EN | 13 paires FR/EN (2 de plus : 29/07 et 14/09) |
| Dernier commit | 13/09/2026 | 14/09/2026 |

Le dépôt B contient encore `hugo.toml`, `layouts/`, `archetypes/`, `assets/` (vestiges non utilisés par le build React, signalés comme tels dans son README). Son README indique encore une URL de site périmée (`alephbeth-ai.github.io`, qui redirige en 301 vers www).

**Conséquence :** la spec vise alephbeth.ai, donc le dépôt B est la cible par défaut. Mais le choix du générateur (§6 ci-dessous) décide aussi du dépôt de travail.

---

## 1. Arborescence

### Dépôt A (Hugo)

```
hugo.toml                      config multilingue (EN par défaut à /, FR sous /fr/)
archetypes/default.md
content/{en,fr}/               _index.md, contact.md, search.md, posts/*.md
layouts/index.html             accueil sur mesure (derniers articles + 4 thèmes colorés)
layouts/partials/              header.html (wordmark + emblème), extend_head.html, extend_footer.html
layouts/shortcodes/            checklist, details, stat, widget
layouts/_default/_markup/      render-codeblock-mermaid.html
assets/css/extended/           alephbeth.css (charte), interactive.css
assets/js/interactive.js
static/favicon.svg
static/widgets/                lstm, cnn, transformer (×2 langues)
themes/PaperMod/               sous-module
.github/workflows/hugo.yml
```

### Dépôt B (React)

```
index.html                     coquille SPA (lang="en" codé en dur, Google Fonts)
vite.config.ts                 publicDir: static, base: /
src/App.tsx                    onglets Articles / Lab / Contact, hero, recherche, filtres
src/router.ts                  routeur History API maison (/, /fr/, /posts/<slug>/, /lab/, /contact/)
src/seo.ts                     title, description, canonical, hreflang, OG, Twitter (côté client)
src/data/posts.ts              import.meta.glob des .md → bundle JS
src/data/site.json             url, nom, titres, descriptions FR/EN
src/components/                Header, Footer, PostCard, PostView, PostContent (marked + mermaid),
                               ContactView, FeaturedCarousel, InteractiveShowcase, WidgetEmbed…
scripts/postbuild.mjs          pré-rendu d'un index.html par route + sitemap, robots, RSS, 404
content/{en,fr}/posts/*.md     mêmes fichiers que A (+2 articles)
static/                        favicon.svg, logo.jpg (701 Ko), og-image.jpg, widgets/ (5 widgets ×2)
metadata.json                  vestige d'un scaffold (mentionne une capacité « Gemini API », non utilisée)
.github/workflows/deploy.yml   build + Pages
.github/workflows/node.js.yml  CI matrice Node 18/20/22 (redondante avec deploy.yml)
```

---

## 2. Pages et articles

### Pages hors articles (sur www.alephbeth.ai)

| URL | Contenu | Langue |
|---|---|---|
| `/` | Accueil : carrousel « à la une », outils interactifs, liste filtrable des articles | EN |
| `/fr/` | Idem | FR |
| `/lab/`, `/lab/<id>/` | Lab interactif (transformer, lstm, cnn, tokens, hardening) | EN |
| `/fr/lab/…` | Idem | FR |
| `/contact/`, `/fr/contact/` | Pitch + `mailto:contact@alephbeth.ai` en clair + 4 sujets | EN / FR |
| `/404.html` | Même coquille, vue « page introuvable » | EN |
| `/sitemap.xml`, `/robots.txt`, `/rss.xml`, `/fr/rss.xml` | Générés au post-build | — |

Schéma d'URL : **EN à la racine, FR sous `/fr/`**. Les 42 URL du sitemap répondent toutes en 200.

### Articles (13 paires, liées par `translationKey`)

| Date | Titre (FR) | Thème | Catégorie | Dans A | Dans B |
|---|---|---|---|---|---|
| 2026-04-27 | Claude Desktop — Durcissement simple | hardening | Durcissement | ✓ | ✓ |
| 2026-06-10 | Le SOC agentique — et les attaques contre les agents IA de défense | agents | Analyse | ✓ | ✓ |
| 2026-06-12 | Comment fonctionnent les LLM : du LSTM au Transformer | fundamentals | Fondamentaux | ✓ | ✓ |
| 2026-06-12 | La guerre des IA sur nos réseaux | fundamentals | Stratégie | ✓ | ✓ |
| 2026-06-18 | Les SIEM agentiques comme nouvelle surface d'attaque | agents | Analyse | ✓ | ✓ |
| 2026-06-21 | La backdoor par le tier gratuit | poisoning | Analyse | ✓ | ✓ |
| 2026-06-21 | Backdoor DPO conditionnel | poisoning | Analyse | ✓ | ✓ |
| 2026-06-29 | L'instruction qui ne protège rien | fundamentals | Fondamentaux | ✓ | ✓ |
| 2026-06-29 | Quand l'IA passe à l'acte | agents | Vulgarisation | ✓ | ✓ |
| 2026-06-29 | Quand les gardiens sont eux-mêmes des agents | agents | Vulgarisation | ✓ | ✓ |
| 2026-07-29 | Leurrer, détecter, épuiser : agents IA offensifs | — | — | ✗ | ✓ |
| 2026-09-13 | L'arme cachée dans la page | agents | Analyse | ✓ | ✓ |
| 2026-09-14 | Quand le web devient une arme : attaques contre les agents IA | — | — | ✗ | ✓ |

URL : `/posts/<slug-en>/` et `/fr/posts/<slug-fr>/` (slug = nom de fichier daté). Front matter : `title, date, draft, tags, categories, theme, summary, translationKey`. Aucun champ `author` dans les articles ; `params.author = "aleph-beth"` dans `hugo.toml` du dépôt A.

Tags : une quarantaine, **non harmonisés entre langues** (`prompt-injection` / `injection-de-prompt`, `llm-security` / `securite-llm`…). Les deux articles propres au dépôt B n'ont pas de `theme` (ils tombent dans « Autres » côté Hugo).

Shortcodes utilisés dans le contenu : `checklist` (8), `details` (16), `widget` (6), `relref` (24).

---

## 3. Déploiement

| | A (Hugo) | B (React) |
|---|---|---|
| Branche | `main`, push → build | `main`, push → build |
| Pages | Source « GitHub Actions », HTTPS forcé | Source « GitHub Actions », HTTPS forcé, domaine `www.alephbeth.ai` **vérifié** |
| Fichier `CNAME` | aucun | aucun (domaine configuré côté réglages du dépôt) |
| DNS | — | `www` → CNAME GitHub Pages (185.199.108-111.153) ; **apex `alephbeth.ai` → 213.186.33.5 (hébergeur/registrar), HTTPS en échec (connexion réinitialisée)** |
| Protection de `main` | **aucune** (ni branch protection, ni ruleset) | **aucune** |
| Dependabot alerts | désactivé | activé (mises à jour de sécurité désactivées) |
| Secret scanning | activé + push protection | **désactivé** |
| `dependabot.yml` | absent | absent |
| `npm audit` (prod) | — | 0 vulnérabilité |
| 2FA du compte | non vérifiable par l'audit | non vérifiable par l'audit |

---

## 4. Dépendances externes chargées par les pages

| Ressource | A (github.io) | B (www.alephbeth.ai) |
|---|---|---|
| Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) | Geist, Geist Mono, Instrument Serif | Plus Jakarta Sans, JetBrains Mono |
| Mermaid 11 depuis `cdn.jsdelivr.net` (module ES, sans SRI) | sur les pages avec diagramme | idem (chargement différé) |
| Scripts/styles tiers autres | aucun | aucun |
| Trackers, analytics, pixels | **aucun** | **aucun** |
| iframes | widgets locaux (`/widgets/*.html`, même origine) | idem |
| Poids de la page d'accueil | HTML statique PaperMod | **720 Ko de JS** (`index-*.js`, tous les articles inclus dans le bundle) + 35 Ko CSS + **logo.jpg 701 Ko** sur chaque page |

Aucun des deux sites n'émet de `Content-Security-Policy`, de `Referrer-Policy` ni de `security.txt`.

---

## 5. Problèmes constatés

### Contenu et liens

1. **Liens internes cassés sur www.alephbeth.ai** : le moteur React ne gère pas le shortcode `relref`. Dans 8 articles (24 occurrences), le texte brut `[Titre]({{< relref "…" >}})` apparaît tel quel au lecteur. Vérifié en ligne sur l'article « The Instruction That Protects Nothing ». Côté Hugo ces liens fonctionnent.
2. Contenu divergent : 2 articles n'existent que dans B ; chaque nouvel article doit aujourd'hui être poussé deux fois.
3. Tags non harmonisés FR/EN ; `theme` absent sur 2 articles.
4. Adresse e-mail en clair dans le HTML (`mailto:contact@alephbeth.ai`) sur les deux sites.
5. Page 404 de B déclarée `lang="en"` quelle que soit l'URL.

### SEO et partage

6. B : les métadonnées (title, description, canonical, hreflang, OG) sont correctes et pré-rendues par page ; mais **le corps des articles n'est pas dans le HTML** (rendu client), ce qui pénalise les aperçus et les robots sans JavaScript. A : HTML complet, sitemap et RSS natifs, pas d'image OG.
7. Aucune donnée structurée JSON-LD sur les deux sites.
8. `hugo.toml` de A a pour `baseURL` l'URL github.io ; `title` « AI Watchtower » et non « AlephBeth ».

### Performance

9. B : bundle JS de 720 Ko incluant le Markdown de tous les articles ; logo JPEG de 701 Ko chargé dans l'en-tête et le pied de page ; polices distantes. Objectif Lighthouse Performance ≥ 90 mobile improbable en l'état (non mesuré : à faire au lot L6).
10. A : léger, mais polices Google distantes et Mermaid CDN.

### Accessibilité (vérification rapide, non exhaustive)

11. B, page article : un seul `h1`, toutes les images ont un `alt`, `lang` correct. Lien d'évitement, focus visible et navigation clavier complète : **à vérifier** au lot L6 sur les deux bases.

### Sécurité

12. Pas de CSP, pas de `Referrer-Policy`, pas de `security.txt`.
13. Mermaid chargé depuis un CDN sans `integrity`, et nécessitant du style inline (incompatible avec une CSP stricte sans aménagement).
14. Polices chargées depuis Google (fuite d'adresse IP des visiteurs vers un tiers, contraire à §7 et §11).
15. **Apex `alephbeth.ai` inaccessible en HTTPS** ; seul `www` fonctionne. Un visiteur tapant `alephbeth.ai` obtient une erreur.
16. Aucune protection de la branche `main` sur les deux dépôts ; secret scanning désactivé sur B ; pas de `dependabot.yml`.
17. `logo.jpg` (B) embarque un conteneur de métadonnées JUMBF/C2PA (« content credentials », typique d'une image générée ou traitée par un outil IA). Pas d'EXIF classique détecté. À purger et à remplacer par un SVG.
18. `metadata.json` (B) mentionne une capacité « serveur Gemini API » : vestige de scaffold, trompeur pour un auditeur, à supprimer.

### Séparation des identités (§4)

19. Commits : adresses `noreply` GitHub sur les deux dépôts (aucune adresse personnelle). Les **noms d'auteur de commit** (« Gregory L. », « G. ») sont visibles dans l'historique public des deux dépôts.
20. Aucune référence à un autre site, pseudonyme, compte ou identifiant d'analytics trouvée dans le contenu, les layouts, les configs ou les workflows des deux dépôts.
21. Les deux dépôts se référencent mutuellement par la marque AlephBeth uniquement (liens GitHub dans les pieds de page).

---

## 6. Recommandation : générateur et dépôt

La règle de la spec est « conserver sauf blocage majeur justifié ». Le générateur **actuellement en production sur alephbeth.ai est la SPA React**. Je recommande néanmoins de **consolider sur Hugo** (base de code du dépôt A, déployée dans le dépôt B qui porte le domaine), pour les raisons suivantes :

1. **Adéquation à la spec.** §7 demande un JS minimal sans framework ; §8 et §10 demandent un HTML complet, rapide et indexable ; §11 demande une CSP sans `unsafe-inline` ; §12 demande un fichier de configuration central (`data/site.yml` existe nativement dans Hugo). La SPA va à contre-courant de chacun de ces points, et le pré-rendu maison (`postbuild.mjs`, `router.ts`, `seo.ts`) réimplémente ce que Hugo fournit d'office (multilingue, `hreflang`, sitemap, RSS, alias de redirection, taxonomies, recherche).
2. **Dette déjà visible.** Le rendu Markdown maison casse déjà des liens en production (`relref`, 24 occurrences) et chaque shortcode doit être recodé à la main en React. Chaque futur gabarit (étude de cas, fiche service, FAQ) ajouterait du JS.
3. **Capital existant.** Le dépôt A porte déjà la charte AlephBeth, l'accueil par thèmes, le vocabulaire de catégories, les shortcodes et le rendu Mermaid. Le site commercial repart de cette base plutôt que de refaire le design sous Tailwind.
4. **Fin de la divergence.** Un seul dépôt, un seul site, un seul endroit où publier.

**Ce que la migration coûte** (absorbé dans le lot L2) :
- reporter les 2 articles propres au dépôt B et les 2 widgets qui n'existent qu'en B (`tokens`, `hardening`) ;
- recréer la page « Lab » comme section Hugo (les widgets sont des HTML statiques, déjà compatibles via le shortcode `widget`) ;
- abandonner le carrousel et le filtre client de l'accueil (remplacés par l'accueil commercial de la spec, qui n'en a pas besoin) ;
- remplacer le code React du dépôt B par la base Hugo (le domaine, la config Pages et l'organisation GitHub restent inchangés).

**Alternative si vous préférez garder React** : c'est faisable, mais il faudra au minimum corriger `relref`, sortir les articles du bundle (chargement par fichier), pré-rendre le corps des articles dans le HTML, auto-héberger les polices, réduire le logo, puis réimplémenter en React chaque composant de §7. Je l'estime nettement plus long que la migration, pour un résultat moins conforme à §7–§11.

### Point d'attention : inversion des langues

Aujourd'hui l'anglais est à la racine (`/posts/<slug>/`) et le français sous `/fr/`. La spec veut le français à la racine et l'anglais sous `/en/`. Pour ne casser aucune URL (règle 4), Hugo génère des **pages de redirection** (`aliases`) : `/posts/<slug-en>/` → `/en/posts/<slug-en>/` et `/fr/posts/<slug-fr>/` → `/posts/<slug-fr>/`. Les anciens liens continuent de fonctionner, les canoniques et le sitemap pointent vers les nouvelles adresses. C'est la question 6 ci-dessous.

---

## 7. Questions ouvertes (à trancher avant L2)

1. **Générateur et dépôt** : consolider sur Hugo dans le dépôt `alephbeth-ai` (recommandé), ou conserver la SPA React ?
2. **Domaine** : corriger l'apex `alephbeth.ai` (A/ALIAS vers GitHub Pages, ou redirection HTTPS valide vers `www`) ? D'autres domaines à rediriger ?
3. **Service de formulaire** : Formspree, Tally, ou autre ? (endpoint à fournir)
4. **Analytics** : aucune (défaut), ou Plausible/Umami ?
5. **Bilinguisme au lancement** : FR complet d'abord puis EN, ou les deux ?
6. **Langues et URL** : français à la racine avec redirections des anciennes URL anglaises (conforme à la spec), ou conserver l'anglais à la racine ?
7. **Lab interactif** : conserver une page « Lab » publique (sous `/recherche/` par exemple), ou n'embarquer les widgets que dans les articles ?
8. **Devenir du dépôt personnel** : archive en lecture seule après migration, ou miroir ?

---

## 8. Plan proposé (une PR par lot, branche `feat/site-commercial`)

| Lot | Contenu | Dépend de |
|---|---|---|
| L1 | Ce rapport | validation |
| L2 | Base Hugo dans le dépôt cible : `data/site.yml` (`launch_mode`), gabarits, nav, pied de page, 404, polices auto-hébergées, report des 2 articles et 2 widgets, alias de redirection des anciennes URL | Q1, Q6 |
| L3 | Accueil, Services, Agent IA Guard (FR, mode `pre`) | L2 |
| L4 | Contact (formulaire tiers + honeypot), mentions légales/confidentialité (gabarit) | Q3 |
| L5 | Blog reclassé : tags harmonisés, `theme` partout, bloc CTA de fin d'article, page Recherche, gabarit « Étude de cas » | L2 |
| L6 | SEO : OG, JSON-LD, sitemap, `hreflang`, Lighthouse | L3–L5 |
| L7 | Sécurité : CSP via `<meta>`, Mermaid auto-hébergé avec SRI, `security.txt`, Dependabot, protection de branche, `docs/SECURITE.md` | L2 |
| L8 | Version anglaise | Q5 |
| L9 | Test de bascule `launch_mode: "open"` | L3, L4 |

Corrections rapides indépendantes du plan, à faire dès L2 : liens `relref` en production, apex HTTPS, logo JPEG → SVG, suppression de `metadata.json`, README du dépôt B, workflow `node.js.yml` redondant.

---

## 9. Décisions (validation du 13/10/2026)

| Question | Décision |
|---|---|
| 1. Générateur et dépôt | **Hugo**, consolidé dans le dépôt `alephbeth-ai/AI-Watchtower` (qui porte le domaine). La SPA React est retirée au lot L2. |
| 2. Domaine | **Corriger l'apex** `alephbeth.ai` : enregistrements A/AAAA vers GitHub Pages chez le registrar, redirection automatique vers `www`. Instructions fournies avec le lot L2. |
| 3. Formulaire | **Formspree** (endpoint à fournir). En attendant : formulaire désactivé proprement, lien e-mail de secours. |
| 4. Analytics | **Aucune** au lancement (`analytics.enabled: false`). |
| 5. Bilinguisme | **FR et EN** dès la première mise en ligne. |
| 6. Langues et URL | **Anglais à la racine conservé pour l'instant** (`/` EN, `/fr/` FR). L'inversion vers le français à la racine est reportée ; elle se fera par alias de redirection quand elle sera décidée. |
| 7. Lab interactif | **Page Lab conservée** comme section Hugo. |
| 8. Dépôt personnel | **Archivé** en lecture seule et publication github.io désactivée une fois alephbeth.ai migré. |
