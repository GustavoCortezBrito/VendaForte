'use client'

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { AlertTriangle, KeyRound, Loader2, Trash2, UserPlus } from 'lucide-react'
import AdminNav from '@/components/admin/AdminNav'
import { ROLES, ROLE_HELP, ROLE_LABEL, type Role } from '@/lib/permissions'

interface UserRow {
  id: string
  email: string
  name: string
  role: Role
  created_at: string
}

const FIELD =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-100'
const LABEL = 'mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500'
const PASSWORD_MIN = 10

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [me, setMe] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'revisor' as Role })
  const [resetting, setResetting] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState('')

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/usuarios')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) setError(data.error || 'Não foi possível carregar os usuários.')
      else {
        setError('')
        setUsers(data.users)
        setMe(data.me)
      }
    } catch {
      setError('Sem conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Depois da primeira renderização: o carregamento muda o estado da tela
    void Promise.resolve().then(load)
  }, [load])

  async function call(request: () => Promise<Response>, okText: string) {
    setBusy(true)
    setMessage(null)
    try {
      const res = await request()
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage({ ok: false, text: data.error || 'Não foi possível concluir.' })
        return false
      }
      setMessage({ ok: true, text: okText })
      await load()
      return true
    } catch {
      setMessage({ ok: false, text: 'Sem conexão com o servidor.' })
      return false
    } finally {
      setBusy(false)
    }
  }

  async function create(event: FormEvent) {
    event.preventDefault()
    const ok = await call(
      () => fetch('/api/usuarios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }),
      `${form.name} já pode entrar com o e-mail e a senha que você definiu.`
    )
    if (ok) setForm({ name: '', email: '', password: '', role: 'revisor' })
  }

  async function savePassword(id: string, name: string) {
    const ok = await call(
      () => fetch('/api/usuarios', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, password: newPassword }) }),
      `Senha de ${name} trocada.`
    )
    if (ok) {
      setResetting(null)
      setNewPassword('')
    }
  }

  const changeRole = (user: UserRow, role: Role) =>
    call(
      () => fetch('/api/usuarios', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id, role }) }),
      `${user.name} agora é ${ROLE_LABEL[role].toLowerCase()}. A mudança vale no próximo login dessa pessoa.`
    )

  function remove(user: UserRow) {
    if (!window.confirm(`Remover ${user.name} (${user.email})? A pessoa perde o acesso no próximo login.`)) return
    call(() => fetch(`/api/usuarios?id=${encodeURIComponent(user.id)}`, { method: 'DELETE' }), `${user.name} removido.`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <AdminNav active="usuarios" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Cada pessoa entra com o próprio e-mail e senha. Crie o login do Paulo e do Rodrigo como Revisor: eles leem, comentam e aprovam, sem alterar catálogo nem posts.
          </p>
        </header>

        {message && (
          <p role="status" className={`mb-6 rounded-2xl border px-5 py-3 text-sm font-semibold ${message.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
            {message.text}
          </p>
        )}

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="animate-spin text-red-600" size={32} />
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-800">
            <AlertTriangle size={18} className="mb-2" /> {error}
          </div>
        ) : (
          <div className="space-y-8">
            <ul className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {users.map((user) => (
                <li key={user.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <span className="min-w-[14rem] flex-1">
                      <span className="block text-sm font-bold text-gray-900">
                        {user.name} {user.id === me && <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">você</span>}
                      </span>
                      <span className="block text-xs text-gray-500">{user.email}</span>
                    </span>

                    <label className="shrink-0">
                      <span className="sr-only">Perfil de {user.name}</span>
                      <select
                        value={user.role}
                        disabled={busy}
                        onChange={(e) => changeRole(user, e.target.value as Role)}
                        className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 focus:border-red-500 focus:outline-none"
                      >
                        {ROLES.map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABEL[role]}
                          </option>
                        ))}
                      </select>
                    </label>

                    <button
                      onClick={() => {
                        setResetting(resetting === user.id ? null : user.id)
                        setNewPassword('')
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                    >
                      <KeyRound size={14} /> Trocar senha
                    </button>
                    {user.id !== me && (
                      <button
                        onClick={() => remove(user)}
                        disabled={busy}
                        className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        title={`Remover ${user.name}`}
                        aria-label={`Remover ${user.name}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {resetting === user.id && (
                    <div className="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <label className="min-w-[16rem] flex-1">
                        <span className={LABEL}>Nova senha (mínimo {PASSWORD_MIN} caracteres)</span>
                        <input type="password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={FIELD} />
                      </label>
                      <button
                        onClick={() => savePassword(user.id, user.name)}
                        disabled={busy || newPassword.length < PASSWORD_MIN}
                        className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        Salvar senha
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <form onSubmit={create} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-900">
                <UserPlus size={16} /> Novo usuário
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label>
                  <span className={LABEL}>Nome</span>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="off" className={FIELD} />
                </label>
                <label>
                  <span className={LABEL}>E-mail</span>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="off" className={FIELD} />
                </label>
                <label>
                  <span className={LABEL}>Senha (mínimo {PASSWORD_MIN} caracteres)</span>
                  <input required type="password" minLength={PASSWORD_MIN} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" className={FIELD} />
                </label>
                <label>
                  <span className={LABEL}>Perfil</span>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className={FIELD}>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABEL[role]}
                      </option>
                    ))}
                  </select>
                  <span className="mt-1 block text-xs text-gray-500">{ROLE_HELP[form.role]}</span>
                </label>
              </div>
              <p className="mt-4 text-xs text-gray-500">Passe a senha à pessoa por um canal privado. A senha nunca aparece de novo aqui; para mudar, use “Trocar senha”.</p>
              <button type="submit" disabled={busy} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-red-600/20 hover:bg-red-700 disabled:opacity-60">
                {busy ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                Criar usuário
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
