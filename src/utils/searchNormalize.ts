// Re-exported from the shared location so both the client and the chat API
// serverless function use the exact same normalization logic. See shared/searchNormalize.ts.
export { normalizeArabic, tokenizeQuery } from '../../shared/searchNormalize';
