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
      className="group relative flex flex-col justify-between p-6 bg-white dark:bg-[#1a1a18] rounded-2xl border border-black/10 dark:border-white/10 hover:border-blue-500/50 dark:hover:border-blue-500/50 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div>
        {/* Category & Featured badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
            {post.categories[0] || 'Article'}
          </span>
          {post.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60">
              {post.lang === 'en' ? 'Interactive / Featured' : 'Interactif / À la une'}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#1a1a18] dark:text-[#ededeb] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2.5">
          {post.title}
        </h2>

        {/* Summary */}
        <p className="text-sm text-[#6b6b66] dark:text-[#a3a39d] line-clamp-3 leading-relaxed mb-4">
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
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono rounded bg-[#f5f5f3] dark:bg-[#242422] text-[#6b6b66] dark:text-[#a3a39d]"
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer Meta */}
        <div className="pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs text-[#6b6b66] dark:text-[#a3a39d]">
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

          <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-1 transition-transform">
            {post.lang === 'en' ? 'Read' : 'Lire'} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </article>
  );
};
