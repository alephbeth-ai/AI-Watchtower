import React, { useState, useEffect } from 'react';
import { Language, Post } from './types';
import { getPostsByLang, getTranslation } from './data/posts';
import { DEFAULT_WIDGET_ID, getWidgets } from './data/widgets';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PostCard } from './components/PostCard';
import { PostView } from './components/PostView';
import { InteractiveShowcase } from './components/InteractiveShowcase';
import { ContactView } from './components/ContactView';
import { Shield, Sparkles, Filter, Search, ArrowRight, Cpu } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'articles' | 'interactive' | 'contact'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeWidgetId, setActiveWidgetId] = useState<string>(DEFAULT_WIDGET_ID);
  const [widgetPickedFromHero, setWidgetPickedFromHero] = useState<boolean>(false);

  // Sync dark class on html root and persist preference
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Get posts for selected language
  const posts = getPostsByLang(lang);

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(posts.flatMap((p) => p.categories)))];

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      selectedCategory === 'all' || post.categories.includes(selectedCategory);

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.tags.some((t) => t.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    if (selectedPost) {
      // Stay on the same article in the other language; fall back to the list
      // when that article has no counterpart.
      setSelectedPost(getTranslation(selectedPost, newLang) || null);
    }
  };

  const featuredPost = posts.find(
    (p) => p.slug.includes('how-llms-work') || p.slug.includes('comprendre-llm')
  ) || posts[0];

  const widgets = getWidgets(lang);

  const openWidget = (widgetId: string) => {
    setActiveWidgetId(widgetId);
    setWidgetPickedFromHero(true);
    setSelectedPost(null);
    setActiveTab('interactive');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#080d1a] text-[#0f172a] dark:text-[#f1f5f9] transition-colors font-sans">
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
        onThemeToggle={() => setIsDark((prev) => !prev)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedPost(null);
          setWidgetPickedFromHero(false);
        }}
      />

      <div className="flex-1">
        {selectedPost ? (
          <PostView
            post={selectedPost}
            lang={lang}
            onBack={() => setSelectedPost(null)}
            onSelectPost={(p) => setSelectedPost(p)}
            onLanguageChange={handleLanguageChange}
          />
        ) : activeTab === 'interactive' ? (
          <InteractiveShowcase
            lang={lang}
            initialWidgetId={activeWidgetId}
            focusWidget={widgetPickedFromHero}
            onWidgetChange={setActiveWidgetId}
          />
        ) : activeTab === 'contact' ? (
          <ContactView lang={lang} />
        ) : (
          <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">
            {/* Hero Section */}
            {!searchQuery && selectedCategory === 'all' && (
              <section className="mb-12 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-900/50 shadow-sm relative overflow-hidden">
                {/* Background circuit glow effect */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold font-mono bg-cyan-50 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300/80 dark:border-cyan-700/80 mb-4 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                      {lang === 'en' ? 'Aleph Beth (אב · أب) — Defensive AI Security' : 'Aleph Beth (אב · أب) — Observatoire Sécurité IA'}
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mb-4">
                      {lang === 'en' ? (
                        <>
                          Practical Hardening & <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400 to-sky-400">
                            Agentic Security Research
                          </span>
                        </>
                      ) : (
                        <>
                          Recherche en Sécurité & <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400 to-sky-400">
                            Durcissement des Agents IA
                          </span>
                        </>
                      )}
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      {lang === 'en'
                        ? 'Deep-dives into prompt injections, MCP server security, LLM internals, and actionable defensive checklists for production systems.'
                        : 'Analyses approfondies sur l\'injection de prompt, la sécurité des serveurs MCP, le fonctionnement interne des LLM et des guides de durcissement.'}
                    </p>

                    {/* Featured Post Card Banner */}
                    {featuredPost && (
                      <div
                        onClick={() => setSelectedPost(featuredPost)}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-[#162032] border border-slate-200 dark:border-cyan-900/40 hover:border-cyan-500/60 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:shadow-cyber-cyan"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono">
                              {lang === 'en' ? 'Featured Interactive Guide' : 'Guide Interactif À La Une'}
                            </span>
                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {featuredPost.title}
                            </h3>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                          {lang === 'en' ? 'Explore Diagrams' : 'Voir Les Schémas'} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Logo Display Showcase */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="relative group p-1.5 rounded-3xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-cyber-cyan">
                      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-[22px] overflow-hidden bg-[#080d1a] flex items-center justify-center relative">
                        <img
                          src="/logo.jpg"
                          alt="AI Watchtower Emblem"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                    <span className="mt-3 text-xs font-semibold text-slate-500 dark:text-cyan-400/90 tracking-wider flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      Aleph Beth · אב · أب
                    </span>
                  </div>
                </div>

                {/* Every interactive tool, straight from the homepage */}
                <div className="relative z-10 mt-8 pt-8 border-t border-slate-200 dark:border-cyan-950/80">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                      <Cpu className="w-3.5 h-3.5 text-cyan-500" />
                      {lang === 'en' ? 'Interactive tools' : 'Outils interactifs'}
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800">
                        {widgets.length}
                      </span>
                    </h2>
                    <button
                      onClick={() => openWidget(activeWidgetId)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:gap-2 transition-all"
                    >
                      {lang === 'en' ? 'Open the full lab' : 'Ouvrir le labo complet'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {widgets.map((w) => {
                      const Icon = w.icon;
                      return (
                        <button
                          key={w.id}
                          onClick={() => openWidget(w.id)}
                          className="p-4 rounded-2xl text-left bg-slate-50 dark:bg-[#162032] border border-slate-200/80 dark:border-cyan-950 hover:border-cyan-500/60 hover:shadow-cyber-cyan transition-all group"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="p-2 rounded-xl bg-white dark:bg-[#0f172a] text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-cyan-900/40 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 text-right">
                              {w.badge}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors mb-1">
                            {w.shortTitle}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {w.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </section>
            )}

            {/* Mobile Search Input */}
            <div className="sm:hidden mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search articles...' : 'Rechercher...'}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-900/50 rounded-xl text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-cyan-500" />
                {lang === 'en' ? 'Topics:' : 'Sujets :'}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white shadow-cyber-cyan'
                      : 'bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-cyan-950 hover:border-cyan-500/50'
                  }`}
                >
                  {cat === 'all' ? (lang === 'en' ? 'All Topics' : 'Tous les sujets') : cat}
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onSelect={(p) => setSelectedPost(p)} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-cyan-950 my-8">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {lang === 'en' ? 'No articles found matching your criteria.' : 'Aucun article trouvé.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-cyan-600 text-white rounded-xl shadow-sm"
                >
                  {lang === 'en' ? 'Reset Filters' : 'Réinitialiser les filtres'}
                </button>
              </div>
            )}
          </main>
        )}
      </div>

      <Footer lang={lang} />
    </div>
  );
}
