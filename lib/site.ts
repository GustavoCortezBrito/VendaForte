/**
 * Endereço oficial do site. O domínio sem "www" redireciona para o "www", então canonicals,
 * sitemap e dados estruturados usam sempre o "www". É fixo de propósito: um valor diferente
 * em variável de ambiente (por exemplo, o domínio sem "www") fazia o Google receber
 * canonicals que apontam para uma URL que redireciona.
 */
export const SITE_URL = 'https://www.grupovendaforte.com'
