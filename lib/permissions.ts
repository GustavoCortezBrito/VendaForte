/**
 * Perfis do painel.
 *
 * - admin: tudo, inclusive criar usuários.
 * - editor: cria e edita conteúdo (posts, catálogo, textos das redes).
 * - revisor: só lê, comenta e aprova (Paulo e Rodrigo). Não altera catálogo nem posts.
 */
export type Role = 'admin' | 'editor' | 'revisor'

export const ROLES: Role[] = ['admin', 'editor', 'revisor']

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  revisor: 'Revisor',
}

export const ROLE_HELP: Record<Role, string> = {
  admin: 'Faz tudo e cria os outros usuários.',
  editor: 'Escreve e edita posts, catálogo e textos das redes.',
  revisor: 'Lê, comenta e aprova. Não altera nada do site.',
}

export const FORBIDDEN_EDIT_MESSAGE =
  'Seu perfil só lê, comenta e aprova. Para alterar conteúdo, peça a quem administra o painel.'

export const isRole = (value: unknown): value is Role => typeof value === 'string' && (ROLES as string[]).includes(value)

type WithRole = { role?: string } | null | undefined

export const isAdmin = (user: WithRole) => user?.role === 'admin'

/** Pode criar, editar e excluir conteúdo. O revisor não pode. */
export const canEdit = (user: WithRole) => user?.role === 'admin' || user?.role === 'editor'

/** Pode aprovar ou pedir ajustes num texto de rede social. */
export const canReview = (user: WithRole) => user?.role === 'admin' || user?.role === 'revisor'
