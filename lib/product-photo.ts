/**
 * Foto de produto do catálogo da EP pronta para o palco escuro do site: passa por /api/foto, que tira o
 * fundo branco. Fotos do próprio site (caminho começando com "/") e de outros endereços ficam como estão.
 */
export function stagePhoto(src: string, width = 640): string {
  return /^https:\/\/cdn\.ep-portal\.net\//.test(src) ? `/api/foto?u=${encodeURIComponent(src)}&w=${width}` : src
}
