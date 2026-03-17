import { supabase } from './supabase';

export async function getAllInsights({ category = null, limit = 50, offset = 0 } = {}) {
  let query = supabase
    .from('insights')
    .select('id, slug, title, subtitle, excerpt, category, tags, author, published_at, read_time_minutes, cover_image_url')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getInsightBySlug(slug) {
  const { data, error } = await supabase
    .from('insights')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function getInsightsByCategory(category, limit = 3, excludeSlug = null) {
  let query = supabase
    .from('insights')
    .select('id, slug, title, subtitle, excerpt, category, tags, author, published_at, read_time_minutes, cover_image_url')
    .eq('published', true)
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (excludeSlug) {
    query = query.neq('slug', excludeSlug);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function getCategories() {
  const { data, error } = await supabase
    .from('insights')
    .select('category')
    .eq('published', true);

  if (error) throw error;

  const counts = (data || []).reduce((acc, row) => {
    acc[row.category] = (acc[row.category] || 0) + 1;
    return acc;
  }, {});

  return counts;
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
