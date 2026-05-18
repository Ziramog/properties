import Image from 'next/image';
import StarRating from './StarRating';

function AuthorAvatar({ name, photo }) {
  if (photo) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm flex-shrink-0">
        <Image src={photo} alt={name} fill className="object-cover" sizes="40px" unoptimized />
      </div>
    );
  }

  const initials = name.split(' ').slice(0, 2).map(n => n[0]?.toUpperCase() ?? '').join('');
  const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-rose-500', 'bg-amber-500', 'bg-cyan-500'];
  const color = colors[name.charCodeAt(0) % colors.length];

  return (
    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-semibold ${color} ring-2 ring-white shadow-sm`} aria-label={name}>
      {initials}
    </div>
  );
}

export default function ReviewCard({ review, variant = 'default' }) {
  const isFeatured = variant === 'featured' || review.featured;

  return (
    <article className={`relative flex flex-col p-5 rounded-2xl border transition-all duration-200 ${isFeatured ? 'bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-md shadow-amber-100/40' : 'bg-white border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200'}`} aria-label={`Reseña de ${review.authorName}`}>
      {isFeatured && (
        <span className="absolute top-4 right-4 text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
          Destacada
        </span>
      )}
      <div className="flex items-center gap-3">
        <AuthorAvatar name={review.authorName} photo={review.authorPhoto} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-zinc-900 text-sm truncate">{review.authorName}</p>
          <time dateTime={review.publishTime} className="text-xs text-zinc-400">{review.relativeTimeDescription}</time>
        </div>
      </div>
      <div className="mt-3"><StarRating rating={review.rating} size="sm" /></div>
      {review.text && <p className="text-sm text-zinc-600 leading-relaxed line-clamp-4 mt-3">{review.text}</p>}
      <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-zinc-50">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span className="text-xs text-zinc-400">Reseña de Google</span>
      </div>
    </article>
  );
}
