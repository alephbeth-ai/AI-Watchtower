import type { ComponentType } from 'react';
import { Activity, Binary, Cpu, Layers, ShieldAlert, ShieldCheck, Sparkles } from 'lucide-react';
import { Language } from '../types';

export type WidgetCategory = 'architectures' | 'security' | 'hardening';

/** Structural type for the lucide icons used as card glyphs. */
export type WidgetIcon = ComponentType<{ className?: string }>;

export interface WidgetDef {
  id: string;
  category: WidgetCategory;
  /** Full title, shown above the embedded widget and on the lab cards. */
  title: string;
  /** Compact title for the homepage hero grid. */
  shortTitle: string;
  paper: string;
  src: string;
  description: string;
  badge: string;
  icon: WidgetIcon;
  /** Fixed-viewport widgets (slide decks, dashboards) get their own framed window. */
  variant?: 'flow' | 'app';
  hint?: string;
}

export interface WidgetCategoryDef {
  key: WidgetCategory;
  label: string;
  icon: WidgetIcon;
}

/**
 * Single source of truth for the interactive lab. Consumed both by the
 * Interactive tab and by the homepage hero, so a widget added here shows up
 * in both places at once.
 */
export function getWidgets(lang: Language): WidgetDef[] {
  const en = lang === 'en';

  return [
    {
      id: 'transformer',
      category: 'architectures',
      title: en ? 'The Transformer (Self-Attention)' : 'Le Transformer (Auto-Attention)',
      shortTitle: en ? 'The Transformer' : 'Le Transformer',
      paper: 'Vaswani et al., 2017 — "Attention Is All You Need"',
      src: en ? '/widgets/transformer-en.html' : '/widgets/transformer-fr.html',
      description: en
        ? 'Step through Query, Key, Value projections, attention weights, residual connections, and token prediction. Every word looks directly at every other word in parallel.'
        : 'Suivez étape par étape les projections Requête/Clé/Valeur, les poids d\'attention, les connexions résiduelles et la prédiction. Chaque mot interagit directement avec tous les autres.',
      badge: en ? 'Modern LLM Standard' : 'Standard des LLM modernes',
      icon: Sparkles,
    },
    {
      id: 'lstm',
      category: 'architectures',
      title: en ? 'The LSTM (Gated Recurrent Network)' : 'Le LSTM (Réseau Récurrent à Portes)',
      shortTitle: en ? 'The LSTM' : 'Le LSTM',
      paper: 'Hochreiter & Schmidhuber, 1997',
      src: en ? '/widgets/lstm-en.html' : '/widgets/lstm-fr.html',
      description: en
        ? 'Step through Forget, Input, and Output gates regulating the memory conveyor belt cell state C across time steps.'
        : 'Explorez les portes d\'oubli, d\'entrée et de sortie régulant le tapis roulant de mémoire (état de cellule C) au fil des mots.',
      badge: en ? 'Sequential Recurrence' : 'Récurrence séquentielle',
      icon: Activity,
    },
    {
      id: 'cnn',
      category: 'architectures',
      title: en ? 'The 1D CNN (Sliding Convolutions)' : 'Le CNN 1D (Fenêtre Convolutive Glissante)',
      shortTitle: en ? 'The 1D CNN' : 'Le CNN 1D',
      paper: 'Kim, 2014 / WaveNet, 2016',
      src: en ? '/widgets/cnn-en.html' : '/widgets/cnn-fr.html',
      description: en
        ? 'Slide a kernel filter across neighboring tokens to extract local receptive field features in full parallel.'
        : 'Faites glisser un filtre convolutif sur les jetons voisins pour extraire des motifs locaux en parallèle.',
      badge: en ? 'Parallel Local Filter' : 'Filtre local parallèle',
      icon: Layers,
    },
    {
      id: 'tokens',
      category: 'security',
      title: en
        ? 'Tokens & Tokenization: the Hidden Attack Surface'
        : 'Les Tokens : la matière première invisible des LLM',
      shortTitle: en ? 'Tokens & Tokenization' : 'Tokens & tokenisation',
      paper: 'Sennrich et al. (BPE) · Kudo (Unigram) · "Fishing for Magikarp" · TokenBreak (2025)',
      src: en ? '/widgets/tokens-en.html' : '/widgets/tokens-fr.html',
      description: en
        ? '24-screen interactive deck: BPE, WordPiece and Unigram tokenizers trained live in your browser, plus five families of tokenizer-level attacks — glitch tokens, homoglyphs, TokenBreak, token smuggling, token bombs — and nine hardening measures.'
        : 'Présentation interactive en 24 écrans : tokeniseurs BPE, WordPiece et Unigram entraînés en direct dans votre navigateur, puis cinq familles d\'attaques au niveau du tokeniseur — glitch tokens, homoglyphes, TokenBreak, contrebande et bombes de tokens — et neuf mesures de durcissement.',
      badge: en ? 'Security Deep Dive' : 'Analyse sécurité approfondie',
      icon: Binary,
      variant: 'app',
      hint: en
        ? 'Use ← → or the dots to navigate · fullscreen available'
        : 'Naviguez avec ← → ou les points · plein écran disponible',
    },
    {
      id: 'hardening',
      category: 'hardening',
      title: en
        ? 'Agentic Hardening Lab: Trifecta, ASI Top 10, Checklist'
        : 'Labo de durcissement agentique : trifecta, ASI Top 10, checklist',
      shortTitle: en ? 'Agentic Hardening Lab' : 'Labo de durcissement agentique',
      paper: 'OWASP Agentic Security Initiative — ASI Top 10 (2026) · MAESTRO',
      src: en ? '/widgets/hardening-en.html' : '/widgets/hardening-fr.html',
      description: en
        ? 'Three working tools: tick the capabilities you actually grant an agent and watch the lethal trifecta close, explore the OWASP ASI Top 10 with its mapped countermeasures, and run the hardening checklist — thirty minutes on a workstation, then the deployment posture — with your progress saved locally.'
        : 'Trois outils : cochez les capacités réellement accordées à un agent et voyez la trifecta létale se refermer, explorez l\'OWASP ASI Top 10 et ses contre-mesures, puis déroulez la checklist de durcissement — trente minutes sur un poste, puis la posture de déploiement — avec progression sauvegardée localement.',
      badge: en ? 'Applied Defense' : 'Défense appliquée',
      icon: ShieldCheck,
      variant: 'app',
      hint: en
        ? 'Switch tools with the tabs · fullscreen available'
        : 'Changez d\'outil avec les onglets · plein écran disponible',
    },
  ];
}

export function getWidgetCategories(lang: Language): WidgetCategoryDef[] {
  const en = lang === 'en';

  return [
    {
      key: 'architectures',
      label: en ? 'Model Architectures' : 'Architectures des modèles',
      icon: Cpu,
    },
    {
      key: 'security',
      label: en ? 'Tokens & Security' : 'Tokens & Sécurité',
      icon: ShieldAlert,
    },
    {
      key: 'hardening',
      label: en
        ? 'Practical Hardening & Agentic Security Research'
        : 'Durcissement pratique & recherche en sécurité agentique',
      icon: ShieldCheck,
    },
  ];
}

export const DEFAULT_WIDGET_ID = 'transformer';
