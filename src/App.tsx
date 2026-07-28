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
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'articles' | 'interactive' | 'contact'>('articles');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeWidgetId, setActiveWidgetId] = useState<string>(DEFAULT_WIDGET_ID);
  const [widgetPickedFromHero, setWidgetPickedFromHero] = useState<boolean>(false);

  // Sync dark class on html root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
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
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] dark:bg-[#121211] text-[#1a1a18] dark:text-[#ededeb] transition-colors font-sans">
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
              <section className="mb-12 p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 shadow-sm relative overflow-hidden">
                <div className="max-w-3xl relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-4">
                    <Shield className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'AI Watchtower — AlephBeth' : 'AI Watchtower — AlephBeth'}
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#1a1a18] dark:text-[#ededeb] leading-tight mb-4">
                    {lang === 'en' ? (
                      <>
                        Practical Hardening & <br />
                        <span className="text-blue-600 dark:text-blue-400">Agentic Security Research</span>
                      </>
                    ) : (
                      <>
                        Recherche en Sécurité & <br />
                        <span className="text-blue-600 dark:text-blue-400">Durcissement des Agents IA</span>
                      </>
                    )}
                  </h1>

                  <p className="text-base sm:text-lg text-[#6b6b66] dark:text-[#a3a39d] leading-relaxed mb-6">
                    {lang === 'en'
                      ? 'Deep-dives into prompt injections, MCP server security, LLM internals, and actionable defensive checklists for production systems.'
                      : 'Analyses approfondies sur l\'injection de prompt, la sécurité des serveurs MCP, le fonctionnement interne des LLM et des guides de durcissement.'}
                  </p>

                  {/* Featured Post Card Banner */}
                  {featuredPost && (
                    <div
                      onClick={() => setSelectedPost(featuredPost)}
                      className="p-4 rounded-2xl bg-[#f5f5f3] dark:bg-[#242422] border border-black/10 dark:border-white/10 hover:border-blue-500/50 cursor-pointer transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            {lang === 'en' ? 'Featured Interactive Guide' : 'Guide Interactif À La Une'}
                          </span>
                          <h3 className="font-bold text-sm text-[#1a1a18] dark:text-[#ededeb] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {featuredPost.title}
                          </h3>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                        {lang === 'en' ? 'Explore Diagrams' : 'Voir Les Schémas'} <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  )}
                </div>

                {/* Every interactive tool, straight from the homepage */}
                <div className="relative z-10 mt-8 pt-8 border-t border-black/5 dark:border-white/5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6b6b66] dark:text-[#a3a39d]">
                      <Cpu className="w-3.5 h-3.5 text-blue-500" />
                      {lang === 'en' ? 'Interactive tools' : 'Outils interactifs'}
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {widgets.length}
                      </span>
                    </h2>
                    <button
                      onClick={() => openWidget(activeWidgetId)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
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
                          className="p-4 rounded-2xl text-left bg-[#f5f5f3] dark:bg-[#242422] border border-black/10 dark:border-white/10 hover:border-blue-500/60 hover:shadow-sm transition-all group"
                        >
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="p-2 rounded-xl bg-white dark:bg-[#1a1a18] text-blue-600 dark:text-blue-400 border border-black/5 dark:border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[#6b6b66] dark:text-[#a3a39d] text-right">
                              {w.badge}
                            </span>
                          </div>
                          <h3 className="font-bold text-sm text-[#1a1a18] dark:text-[#ededeb] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1">
                            {w.shortTitle}
                          </h3>
                          <p className="text-xs text-[#6b6b66] dark:text-[#a3a39d] line-clamp-2 leading-relaxed">
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6b66] dark:text-[#a3a39d]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search articles...' : 'Rechercher...'}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 rounded-xl text-[#1a1a18] dark:text-[#ededeb]"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
              <span className="text-xs font-semibold text-[#6b6b66] dark:text-[#a3a39d] flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Topics:' : 'Sujets :'}
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#1a1a18] text-[#6b6b66] dark:text-[#a3a39d] border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
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
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#1a1a18] border border-black/10 dark:border-white/10 my-8">
                <p className="text-sm text-[#6b6b66] dark:text-[#a3a39d] mb-4">
                  {lang === 'en' ? 'No articles found matching your criteria.' : 'Aucun article trouvé.'}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl shadow-sm"
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
