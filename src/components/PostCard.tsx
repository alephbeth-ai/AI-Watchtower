import React from 'react';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  onSelect: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onSelect }) => {
  return (
    <article
      onClick={() => onSelect(post)}
      className="group relative flex flex-col justify-between p-6 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-cyan-950/60 hover:border-cyan-500/60 dark:hover:border-cyan-500/60 shadow-sm hover:shadow-cyber-cyan transition-all cursor-pointer overflow-hidden"
    >
      {/* Top subtle glow line on hover */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-teal-400 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Category & Featured badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold font-mono bg-cyan-50 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-800/60">
            {post.categories[0] || 'Article'}
          </span>
          {post.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60">
              {post.lang === 'en' ? 'Interactive / Featured' : 'Interactif / À la une'}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-2.5">
          {post.title}
        </h2>

        {/* Summary */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
          {post.description}
        </p>
      </div>

      <div>
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded bg-slate-100 dark:bg-[#162032] text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-cyan-950"
              >
                <Tag className="w-2.5 h-2.5 opacity-60 text-cyan-500" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Meta */}
        <div className="pt-3 border-t border-slate-200/60 dark:border-cyan-950/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            {post.readingTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.readingTime} min
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform">
            {post.lang === 'en' ? 'Read' : 'Lire'} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
