export const CURRENT_AUDIO_VERSION =
  import.meta.env.VITE_AUDIO_VERSION || 'openai-gpt-4o-mini-tts-2025-12-15-cedar-za-v1';

export function getAudioStatus(post) {
  if (!post?.audio_url) return 'missing';
  return post.audio_version === CURRENT_AUDIO_VERSION ? 'ready' : 'stale';
}
