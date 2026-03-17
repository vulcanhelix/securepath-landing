import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllInsights, formatDate } from '../utils/insights';

gsap.registerPlugin(ScrollTrigger);

const ALL_CATEGORIES = ['All', 'POPIA', 'GDPR', 'Cybersecurity', 'Compliance', 'Data Governance', 'Privacy', 'Regulatory'];

const FALLBACK_IMAGES = {
  POPIA: 'https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&w=800',
  GDPR: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=800',
  Cybersecurity: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800',
  Compliance: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
  'Data Governance': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
  Privacy: 'https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&w=800',
  Regulatory: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const InsightCard = ({ post }) => {
  const imageUrl = post.cover_image_url || FALLBACK_IMAGES[post.category] || FALLBACK_IMAGES.Compliance;

  return (
    <Link
      to={`/insights/${post.slug}`}
      className="insight-card group relative bg-[#0B0E14] flex flex-col overflow-hidden hover:bg-[#121620] transition-colors duration-300"
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => { e.target.src = FALLBACK_IMAGES.Compliance; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/40 to-transparent" />
        <span className="absolute top-4 left-4 font-mono text-xs font-bold uppercase tracking-[0.15em] text-accent bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-accent/20">
          {post.category}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-8">
        <h2 className="text-xl font-bold text-primary mb-3 leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {post.title}
        </h2>
        {post.subtitle && (
          <p className="text-sm font-drama italic text-accent/70 mb-4 line-clamp-1">
            {post.subtitle}
          </p>
        )}
        <p className="text-primary/60 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 text-xs font-mono text-primary/40">
            <span>{formatDate(post.published_at)}</span>
            <span className="w-1 h-1 bg-primary/20 rounded-full" />
            <span>{post.read_time_minutes} min read</span>
          </div>
          <span className="text-xs font-mono text-accent/60 group-hover:text-accent transition-colors flex items-center gap-1">
            Read
            <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
    </Link>
  );
};

const Insights = () => {
  const containerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllInsights({ category });
      setPosts(data);
    } catch (err) {
      setError('Unable to load insights. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts(activeCategory);
  }, [activeCategory, fetchPosts]);

  useEffect(() => {
    if (!containerRef.current) return;
    let ctx = gsap.context(() => {
      const words = containerRef.current.querySelectorAll('.hero-word');
      if (words.length > 0) {
        gsap.fromTo(words,
          { y: 150, rotateX: -90, opacity: 0 },
          { y: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: 'expo.out', transformPerspective: 1000 }
        );
      }

      gsap.fromTo('.insights-hero-fade',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.15, ease: 'power3.out', delay: 0.4 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (loading || !containerRef.current) return;
    let ctx = gsap.context(() => {
      const cards = containerRef.current.querySelectorAll('.insight-card');
      if (cards.length > 0) {
        gsap.fromTo(cards,
          { opacity: 0, y: 50, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.1 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [posts, loading]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-primary pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-20">
          <div className="overflow-hidden mb-4">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-accent/60 insights-hero-fade">
              Securepath / Insights
            </div>
          </div>

          <div className="overflow-hidden mb-6" style={{ perspective: '1000px' }}>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] font-black uppercase leading-[0.85] tracking-tight">
              {'INSIGHTS'.split('').map((letter, i) => (
                <span key={i} className="hero-word inline-block" style={{ display: 'inline-block' }}>
                  {letter}
                </span>
              ))}
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-end">
            <p className="text-xl md:text-2xl font-light text-primary/60 leading-relaxed insights-hero-fade">
              Expert perspectives on{' '}
              <span className="font-drama italic text-accent">privacy, compliance,</span>
              {' '}and cybersecurity in South Africa and beyond.
            </p>
            <div className="text-right insights-hero-fade">
              <span className="text-xs font-mono text-primary/30 uppercase tracking-widest">
                Thought leadership from the field
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 mb-12 insights-hero-fade">
          <div className="flex flex-wrap gap-3">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-mono font-medium transition-all duration-300 border ${
                  activeCategory === cat
                    ? 'bg-accent text-background border-accent'
                    : 'bg-transparent text-primary/60 border-white/10 hover:text-primary hover:border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-primary/5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#0B0E14] animate-pulse">
                <div className="aspect-[16/9] bg-white/5" />
                <div className="p-8 space-y-4">
                  <div className="h-5 bg-white/5 rounded w-3/4" />
                  <div className="h-4 bg-white/5 rounded w-1/2" />
                  <div className="space-y-2">
                    <div className="h-3 bg-white/5 rounded" />
                    <div className="h-3 bg-white/5 rounded w-5/6" />
                    <div className="h-3 bg-white/5 rounded w-4/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-24">
            <p className="text-primary/40 font-mono text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-32 border border-white/5 rounded-lg">
            <div className="text-6xl font-drama italic text-primary/10 mb-6">No insights yet</div>
            <p className="text-primary/40 font-mono text-sm">
              No published insights in the{' '}
              <span className="text-accent">{activeCategory}</span> category.
            </p>
            {activeCategory !== 'All' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="mt-6 text-xs font-mono text-accent/60 hover:text-accent transition-colors underline underline-offset-4"
              >
                View all categories
              </button>
            )}
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-primary/5">
            {posts.map((post) => (
              <InsightCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
