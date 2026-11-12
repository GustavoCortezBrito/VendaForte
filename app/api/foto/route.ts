import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

/**
 * GET /api/foto?u=<foto do catálogo EP>&w=<384|640|1080>
 *
 * As fotos do catálogo da EP são recortes sobre fundo branco. Aqui o fundo claro ligado à borda some e a
 * sombra do chão vira um preto suave, e o produto fica sobre o palco escuro do site, como na /promo.
 * O branco que fica dentro da máquina (vidro da cabine, painéis) não é tocado, porque não toca a borda.
 * A resposta é cacheada por um ano na CDN: cada foto é processada uma vez.
 */
const ALLOWED_HOST = 'cdn.ep-portal.net'
const WIDTHS = [384, 640, 1080]
const MAX_BYTES = 8 * 1024 * 1024

export const runtime = 'nodejs'

async function cutout(input: Buffer, width: number) {
  const { data, info } = await sharp(input).resize({ width, withoutEnlargement: true }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info
  const N = W * H

  const lum = (i: number) => 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]
  const sat = (i: number) => Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]) - Math.min(data[i * 4], data[i * 4 + 1], data[i * 4 + 2])
  const bgLike = (i: number) => lum(i) > 188 && sat(i) < 26

  // Preenchimento a partir da borda: só o fundo ligado a ela vira transparente
  const seen = new Uint8Array(N)
  const stack = new Int32Array(N)
  let sp = 0
  const push = (i: number) => {
    if (!seen[i] && bgLike(i)) {
      seen[i] = 1
      stack[sp++] = i
    }
  }
  for (let x = 0; x < W; x++) {
    push(x)
    push((H - 1) * W + x)
  }
  for (let y = 0; y < H; y++) {
    push(y * W)
    push(y * W + W - 1)
  }
  while (sp) {
    const i = stack[--sp]
    const x = i % W
    if (x > 0) push(i - 1)
    if (x < W - 1) push(i + 1)
    if (i >= W) push(i - W)
    if (i < N - W) push(i + W)
  }

  for (let i = 0; i < N; i++) {
    if (!seen[i]) continue
    // Quase branco some; cinza claro (sombra no chão) vira preto semitransparente
    const alpha = Math.max(0, Math.min(1, (250 - lum(i)) / 62))
    data[i * 4] = 0
    data[i * 4 + 1] = 0
    data[i * 4 + 2] = 0
    data[i * 4 + 3] = Math.round(alpha * 150)
  }

  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).webp({ quality: 82, alphaQuality: 90 }).toBuffer()
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('u') || ''
  const requested = Number(searchParams.get('w')) || 640
  const width = WIDTHS.find((candidate) => candidate >= requested) ?? WIDTHS[WIDTHS.length - 1]

  let url: URL
  try {
    url = new URL(source)
  } catch {
    return NextResponse.json({ error: 'Endereço inválido.' }, { status: 400 })
  }
  if (url.protocol !== 'https:' || url.hostname !== ALLOWED_HOST) {
    return NextResponse.json({ error: 'Só as fotos do catálogo da EP.' }, { status: 400 })
  }

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10_000) })
    if (!response.ok) return NextResponse.json({ error: 'Foto não encontrada.' }, { status: 502 })
    const original = Buffer.from(await response.arrayBuffer())
    if (original.length > MAX_BYTES) return NextResponse.json({ error: 'Foto grande demais.' }, { status: 413 })

    const body = await cutout(original, width)
    return new NextResponse(new Uint8Array(body), {
      headers: {
        'Content-Type': 'image/webp',
        'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Erro ao recortar a foto:', error)
    return NextResponse.json({ error: 'Não foi possível processar a foto.' }, { status: 502 })
  }
}
