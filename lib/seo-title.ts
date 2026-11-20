/**
 * Largura estimada de um título na página de resultados do Google (Arial 20 px). O Google corta o título
 * perto de 580 px; acima disso o fim some ("..."). A tabela foi calibrada com o Seobility: o título
 * "Venda de empilhadeiras em Chapecó e Joinville | Grupo Venda Forte" mede 618 px lá.
 * scripts/seo/auditar-paginas.cjs tem a mesma conta: se mudar uma, mude a outra.
 */
const ARIAL: Record<string, number> = {
  ' ': 278, a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222, k: 500, l: 222, m: 833,
  n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278, u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500, K: 667, L: 556, M: 833, N: 722,
  O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611, U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  '|': 260, ':': 278, '.': 278, ',': 278, '-': 333, '(': 333, ')': 333, '–': 556, '/': 278, '&': 667, '+': 584, '%': 889,
}

const raw = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split('')
    .reduce((sum, ch) => sum + (ARIAL[ch] ?? 556), 0) * 0.02

const CALIBRATION = 618 / raw('Venda de empilhadeiras em Chapecó e Joinville | Grupo Venda Forte')

export const TITLE_MAX_PX = 580

export const titlePx = (title: string): number => Math.round(raw(title) * CALIBRATION)

/** O primeiro título da lista que cabe (com folga de 5 px); se nenhum couber, o último, que deve ser o mais curto. */
export function fitTitle(...candidates: string[]): string {
  return candidates.find((title) => titlePx(title) <= TITLE_MAX_PX - 5) ?? candidates[candidates.length - 1]
}
