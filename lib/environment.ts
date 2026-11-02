/**
 * Onde o painel está rodando.
 *
 * O `.env.local` aponta para o banco de produção. Sem esta trava, um clique em "Publicar" num
 * servidor de desenvolvimento mudaria o site de verdade. No ambiente local o painel só mexe em
 * rascunhos: nada que esteja no ar (ou que vá para o ar) pode ser alterado por ele.
 */
import { SITE_URL } from '@/lib/site'

interface HeaderReader {
  get(name: string): string | null
}

export const LOCAL_BLOCK_MESSAGE = `Você está num ambiente local, e daqui não dá para publicar nem mexer no que já está no ar. Rascunhos podem ser criados e editados normalmente. Para publicar, abra o painel do site publicado: ${SITE_URL}/admin`

const PRIVATE_HOST = /^(localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|\[?::1\]?|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|[^.]+|.+\.local)$/i

/**
 * `true` quando a requisição vem de uma máquina de desenvolvimento: servidor fora do modo de
 * produção, ou aberto por endereço local (localhost, rede interna, nome sem domínio).
 *
 * `PUBLISH_FROM_LOCAL_FOR_TESTS=1` desliga a trava e existe só para os testes automáticos com um
 * banco falso; não deve ficar em nenhum `.env`.
 */
export function isLocalRequest(headers: HeaderReader): boolean {
  if (process.env.PUBLISH_FROM_LOCAL_FOR_TESTS === '1') return false
  if (process.env.NODE_ENV !== 'production') return true

  const host = (headers.get('x-forwarded-host') || headers.get('host') || '').split(',')[0].trim().replace(/:\d+$/, '')
  // Sem cabeçalho de host não dá para afirmar que é o site publicado: na dúvida, trata como local
  return !host || PRIVATE_HOST.test(host)
}
