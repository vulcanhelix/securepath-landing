/**
 * Flatten a JSONB content array (from the insights table) into natural,
 * TTS-friendly plain text. Adds pauses and transitions so the audio
 * sounds like a narrated article rather than a flat reading.
 */
export function articleToText(content, title = '') {
  const parts = [];

  if (title) {
    parts.push(title + '.\n');
  }

  for (let i = 0; i < content.length; i++) {
    const section = content[i];

    // Section heading — use an ellipsis to create a brief spoken pause
    // before the body, so it sounds like a natural topic transition
    if (section.heading) {
      parts.push(section.heading + '.\n');
    }

    if (section.body) {
      for (const para of section.body) {
        parts.push(ensureTrailingPunctuation(para));
      }
    }

    if (section.subheadings) {
      for (const sub of section.subheadings) {
        // Subheading titles flow into their body with a colon-like pause
        parts.push(sub.title + '.');
        parts.push(ensureTrailingPunctuation(sub.body));
      }
    }

    if (section.list_items) {
      for (const item of section.list_items) {
        parts.push(ensureTrailingPunctuation(item));
      }
    }

    // Add an extra line break between major sections for a longer pause
    if (i < content.length - 1) {
      parts.push('');
    }
  }

  return parts.join('\n\n');
}

/**
 * Ensure text ends with sentence-ending punctuation so TTS
 * produces a natural pause rather than running into the next segment.
 */
function ensureTrailingPunctuation(text) {
  if (!text) return '';
  const trimmed = text.trim();
  if (/[.!?;:]$/.test(trimmed)) return trimmed;
  return trimmed + '.';
}
