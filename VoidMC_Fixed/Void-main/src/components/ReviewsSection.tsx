import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Send } from 'lucide-react';

interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string;
  timestamp: string;
  avatar?: string;
}

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    username: 'elite_ansh',
    rating: 5,
    comment: 'Best Minecraft server ever! The community is amazing and the custom features are insane. Orbital cannon is lit! 🔥',
    timestamp: '2026-10-20',
  },
  {
    id: 'rev_2',
    username: 'DMM_VOID',
    rating: 5,
    comment: '50GB RAM server with 20 TPS stable. No lag at all! The staff is super helpful and events are weekly.',
    timestamp: '2026-10-18',
  },
  {
    id: 'rev_3',
    username: 'VoidStriker_X',
    rating: 5,
    comment: 'Been playing for 3 months now. The dungeon system and custom bosses are next level. Worth every penny!',
    timestamp: '2026-10-15',
  },
  {
    id: 'rev_4',
    username: 'CrystalClasher',
    rating: 4,
    comment: 'Great server with active community. Crystal PvP arena is my favorite. Only wish there were more events!',
    timestamp: '2026-10-12',
  },
  {
    id: 'rev_5',
    username: 'NetherKnight',
    rating: 5,
    comment: 'The Nether Cathedral build is absolutely stunning. Staff is friendly and helpful. Highly recommend!',
    timestamp: '2026-10-10',
  },
  {
    id: 'rev_6',
    username: 'AeroPvP_Pro',
    rating: 5,
    comment: 'Switched from another server and never looked back. VOIDMC has the best custom plugins and features!',
    timestamp: '2026-10-08',
  },
];

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('voidmc_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('voidmc_reviews', JSON.stringify(reviews));
    } catch {}
  }, [reviews]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newComment.trim()) return;

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      username: newUsername.trim(),
      rating: newRating,
      comment: newComment.trim(),
      timestamp: new Date().toISOString().split('T')[0],
    };

    setReviews([newReview, ...reviews]);
    setNewUsername('');
    setNewRating(5);
    setNewComment('');
    setShowForm(false);
  };

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="py-16 bg-[#0B0713]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-purple-400 font-bold">
            PLAYER TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 font-heading tracking-tight">
            WHAT PLAYERS <span className="text-purple-400">SAY</span>
          </h2>
          <p className="text-sm text-slate-400 mt-3 max-w-2xl mx-auto">
            Join thousands of satisfied players on VOIDMC
          </p>

          {/* Rating Summary */}
          <div className="mt-6 inline-flex items-center gap-3 bg-[#130C22] border border-purple-900/40 rounded-2xl px-6 py-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xl font-bold text-white font-mono">{averageRating.toFixed(1)}</span>
            <span className="text-xs text-slate-400 font-mono">({reviews.length} reviews)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {reviews.slice(0, 6).map((review, idx) => (
            <div
              key={review.id}
              className="bg-[#110A1F] border border-purple-900/40 rounded-2xl p-6 hover:border-purple-500/50 transition-all card-hover-lift animate-fade-in-up opacity-0-start"
              style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {review.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{review.username}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{review.timestamp}</div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-sm text-slate-300 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Write Review Button */}
        <div className="text-center">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="btn-press inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm tracking-wide shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all hover:-translate-y-1"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          ) : (
            <form
              onSubmit={handleSubmitReview}
              className="max-w-2xl mx-auto bg-[#110A1F] border border-purple-900/40 rounded-2xl p-6 space-y-4 animate-scale-in"
            >
              <h3 className="text-lg font-bold text-white font-heading">Share Your Experience</h3>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                  Your Username
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. elite_ansh"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || newRating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 font-bold mb-1.5">
                  Your Review
                </label>
                <textarea
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tell us about your experience on VOIDMC..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#160D26] border border-purple-800/60 text-white text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="btn-press inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Review</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-xl bg-[#160D26] hover:bg-[#1E1235] border border-purple-900/40 text-slate-300 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
