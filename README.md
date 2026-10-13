# Aleph Beth — www.alephbeth.ai

Site d'Aleph Beth : sécurité des agents IA (audit, red teaming, protection en production) et publications de recherche sur l'injection de prompts, la sécurité des serveurs MCP, les modèles de menace agentiques et le durcissement.

Site statique bilingue (EN à la racine, FR sous `/fr/`), construit avec [Hugo](https://gohugo.io/) et le thème [PaperMod](https://github.com/adityatelange/hugo-PaperMod), déployé sur GitHub Pages par GitHub Actions à chaque push sur `main`.

## Structure

```
.
├── hugo.toml                       # Configuration Hugo (langues, menus, sorties)
├── data/
│   ├── site.yml                    # Configuration centrale : launch_mode, contact, mentions, tarifs
│   └── lab.yml                     # Catalogue du Lab interactif
├── i18n/{en,fr}.toml               # Chaînes de l'interface
├── content/
│   ├── en/                         # Site anglais : posts/, lab/, contact
│   └── fr/                         # Site français : posts/, lab/, contact
├── layouts/
│   ├── index.html                  # Accueil
│   ├── 404.html                    # Page d'erreur bilingue
│   ├── lab/                        # Gabarits du Lab (liste, page outil)
│   ├── _partials/                  # En-tête, pied de page, bandeau, e-mail, head
│   ├── _shortcodes/                # checklist, details, stat, widget
│   └── _markup/                    # Rendu des blocs Mermaid
├── assets/
│   ├── css/extended/               # Charte (alephbeth.css), composants, polices, interactif
│   └── js/                         # site.js (comportements), interactive.js
├── static/
│   ├── fonts/                      # Polices auto-hébergées (Geist, Geist Mono, Instrument Serif)
│   ├── widgets/                    # Widgets HTML autonomes (×2 langues)
│   ├── favicon.svg · og-image.jpg
├── themes/PaperMod/                # Thème (sous-module git)
├── docs/                           # AUDIT.md, SECURITE.md
└── .github/workflows/hugo.yml      # Construction et déploiement
```

## Configuration centrale

`data/site.yml` pilote tout ce qui dépend de l'état de la société :

- `launch_mode: "pre"` : société en cours de création. Aucun tarif, aucune mention d'entité, formulaire en liste d'attente, bandeau d'annonce.
- `launch_mode: "open"` : mentions légales complètes, tarifs indicatifs, lien de prise de rendez-vous.

Toute valeur vide n'affiche rien.

## Ajouter un article bilingue

Un fichier par langue, même date et même `translationKey` :

```bash
hugo new content/fr/posts/AAAA-MM-JJ-mon-article.md
hugo new content/en/posts/AAAA-MM-JJ-my-article.md
```

Conventions de l'en-tête :

- `translationKey` : identique dans les deux fichiers (lie la paire de langues).
- `theme` : `fundamentals`, `agents`, `poisoning` ou `hardening` (section de l'accueil, couleur).
- `categories` : un seul libellé, miroir FR/EN : `Fondamentaux`/`Fundamentals`, `Vulgarisation`/`Explainer`, `Analyse`/`Analysis`, `Durcissement`/`Hardening`, `Stratégie`/`Strategy`.
- `summary` : une à deux phrases, affichées sur les cartes.

Les liens entre articles utilisent `{{< relref "fichier.md" >}}`.

## Ajouter un outil au Lab

1. Déposer `static/widgets/<id>-en.html` et `static/widgets/<id>-fr.html`.
2. Décrire l'outil dans `data/lab.yml`.
3. Créer `content/en/lab/<id>.md` et `content/fr/lab/<id>.md` avec `widget: <id>`.

## Construction locale

Le thème est un sous-module : sans lui, Hugo produit des pages vides sans erreur.

```bash
git clone --recurse-submodules https://github.com/alephbeth-ai/AI-Watchtower.git
hugo server
```

Si le dépôt a été cloné sans sous-modules : `git submodule update --init --recursive`.

## Licence

Code : voir [LICENSE](LICENSE). Contenu des articles : © Aleph Beth, tous droits réservés sauf mention contraire dans l'article.
