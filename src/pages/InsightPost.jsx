import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getInsightBySlug, getInsightsByCategory, formatDate } from '../utils/insights';
import AudioPlayer from '../components/AudioPlayer';

gsap.registerPlugin(ScrollTrigger);

const FALLBACK_IMAGES = {
  POPIA: 'https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg?auto=compress&cs=tinysrgb&w=1200',
  GDPR: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=1200',
  Cybersecurity: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200',
  Compliance: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'Data Governance': 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
  Privacy: 'https://images.pexels.com/photos/5473956/pexels-photo-5473956.jpeg?auto=compress&cs=tinysrgb&w=1200',
  Regulatory: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=1200',
};

const RelatedCard = ({ post }) => (
  <Link
    to={`/insights/${post.slug}`}
    className="group relative bg-[#0B0E14] flex flex-col overflow-hidden hover:bg-[#121620] transition-colors duration-300"
  >
    <div className="relative overflow-hidden aspect-[16/9]">
      <img
        src={post.cover_image_url || FALLBACK_IMAGES[post.category] || FALLBACK_IMAGES.Compliance}
        alt={post.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        onError={(e) => { e.target.src = FALLBACK_IMAGES.Compliance; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/30 to-transparent" />
      <span className="absolute top-3 left-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-accent bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-accent/20">
        {post.category}
      </span>
    </div>
    <div className="p-6 flex flex-col flex-1">
      <h3 className="text-base font-bold text-primary mb-2 leading-snug group-hover:text-accent transition-colors line-clamp-2">
        {post.title}
      </h3>
      <p className="text-primary/50 text-sm line-clamp-2 flex-1">{post.excerpt}</p>
      <div className="mt-4 flex items-center gap-2 text-xs font-mono text-primary/30">
        <span>{formatDate(post.published_at)}</span>
        <span className="w-1 h-1 bg-primary/20 rounded-full" />
        <span>{post.read_time_minutes} min read</span>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
  </Link>
);

const ArticleSection = ({ section }) => {
  if (section.subheadings && section.subheadings.length > 0) {
    return (
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-drama italic text-accent mb-8">
          {section.heading}
        </h2>
        <div className="space-y-8">
          {section.subheadings.map((sub, i) => (
            <div key={i} className="pl-6 border-l border-accent/20">
              <h3 className="font-mono text-sm uppercase tracking-[0.15em] text-primary/60 mb-3">
                {sub.title}
              </h3>
              <p className="text-primary/80 leading-relaxed text-lg">{sub.body}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16">
      <h2 className="text-3xl md:text-4xl font-drama italic text-accent mb-6">
        {section.heading}
      </h2>
      {(section.body || []).map((para, i) => (
        <p key={i} className="text-primary/80 leading-relaxed text-lg mb-5">{para}</p>
      ))}
      {section.list_items && section.list_items.length > 0 && (
        <ul className="space-y-3 mt-4">
          {section.list_items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-primary/80 text-lg">
              <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 bg-accent rounded-full" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const InsightPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getInsightBySlug(slug).then((data) => {
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setPost(data);
      setAudioUrl(data.audio_url || null);
      setLoading(false);

      getInsightsByCategory(data.category, 3, slug).then((rel) => {
        if (!cancelled) setRelated(rel);
      });
    }).catch(() => {
      if (!cancelled) {
        setNotFound(true);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (!post || !containerRef.current) return;
    let ctx = gsap.context(() => {
      gsap.fromTo('.post-hero-word',
        { y: 100, rotateX: -90, opacity: 0 },
        { y: 0, rotateX: 0, opacity: 1, duration: 1.2, stagger: 0.05, ease: 'expo.out', transformPerspective: 1000 }
      );

      gsap.fromTo('.post-hero-fade',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power3.out', delay: 0.5 }
      );

      gsap.utils.toArray('.article-section').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 60 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' }
          }
        );
      });

      gsap.utils.toArray('.related-card').forEach((el, i) => {
        gsap.fromTo(el,
          { opacity: 0, y: 50, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: i * 0.1,
            scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' }
          }
        );
      });
    }, containerRef);
    return () => ctx.revert();
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <span className="text-primary/40 font-mono text-xs uppercase tracking-widest">Loading</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl font-drama italic text-primary/10 mb-6">Not Found</div>
          <p className="text-primary/40 font-mono text-sm mb-8">This insight does not exist or has been unpublished.</p>
          <Link to="/insights" className="magnetic-btn bg-accent text-background px-6 py-3 rounded-full text-sm font-semibold">
            Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = post.cover_image_url || FALLBACK_IMAGES[post.category] || FALLBACK_IMAGES.Compliance;
  const words = post.title.split(' ');

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-primary">
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-15"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.06)_0%,transparent_60%)]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="post-hero-fade flex items-center gap-3 mb-8">
            <Link to="/insights" className="text-xs font-mono text-primary/40 hover:text-accent transition-colors uppercase tracking-widest">
              Insights
            </Link>
            <span className="text-primary/20 font-mono">/</span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-accent bg-accent/10 px-3 py-1.5 rounded-full border border-accent/20">
              {post.category}
            </span>
          </div>

          <div style={{ perspective: '1000px' }} className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.9] tracking-tight">
              {words.map((word, i) => (
                <span key={i} className="post-hero-word inline-block mr-[0.25em]" style={{ display: 'inline-block' }}>
                  {word}
                </span>
              ))}
            </h1>
          </div>

          {post.subtitle && (
            <p className="post-hero-fade text-xl md:text-2xl font-drama italic text-accent/80 mb-8 max-w-3xl">
              {post.subtitle}
            </p>
          )}

          <div className="post-hero-fade flex flex-wrap items-center gap-4 text-xs font-mono text-primary/40 border-t border-white/5 pt-6">
            <span className="text-primary/60">{post.author}</span>
            <span className="w-1 h-1 bg-primary/20 rounded-full" />
            <span>{formatDate(post.published_at)}</span>
            <span className="w-1 h-1 bg-primary/20 rounded-full" />
            <span>{post.read_time_minutes} min read</span>
            {post.tags && post.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-primary/30 border border-white/5">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="mb-12 post-hero-fade">
          <AudioPlayer
            audioUrl={audioUrl}
            slug={slug}
            onAudioGenerated={(url) => setAudioUrl(url)}
          />
        </div>

        {Array.isArray(post.content) && post.content.map((section, i) => (
          <div key={i} className="article-section">
            <ArticleSection section={section} />
          </div>
        ))}

        <div className="article-section mt-16 p-8 bg-[#0B0E14] border border-accent/10 rounded-lg">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-accent/60 mb-4">Need help with compliance?</p>
          <h3 className="text-2xl font-bold mb-4">Talk to Securepath Consulting</h3>
          <p className="text-primary/60 text-sm leading-relaxed mb-6">
            Our team specialises in practical POPIA, GDPR, and cybersecurity compliance programmes tailored to your organisation. No jargon — just clear, actionable guidance.
          </p>
          <Link to="/contact" className="magnetic-btn inline-flex items-center gap-2 bg-accent text-background px-6 py-3 rounded-full text-sm font-semibold">
            Get in touch
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-[#0a0d14] border-t border-white/5 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-accent/60 block mb-2">Related</span>
                <h2 className="text-3xl font-bold">More in {post.category}</h2>
              </div>
              <Link to={`/insights`} className="text-sm font-mono text-accent/60 hover:text-accent transition-colors flex items-center gap-2">
                All insights
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-primary/5">
              {related.map((rel) => (
                <div key={rel.id} className="related-card">
                  <RelatedCard post={rel} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {related.length === 0 && (
        <div className="border-t border-white/5 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <Link
              to="/insights"
              className="inline-flex items-center gap-3 text-sm font-mono text-primary/40 hover:text-accent transition-colors"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Back to all insights
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightPost;
