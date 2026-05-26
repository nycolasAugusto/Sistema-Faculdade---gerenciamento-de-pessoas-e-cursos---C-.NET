import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ILogin } from './interface'


export function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<ILogin>({
    usuario: '',
    senha: '',
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    navigate('/home')
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            F
          </span>

          <h1 className="text-3xl font-bold text-slate-900">
            Faculdade Prime
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sistema de gerenciamento acadêmico
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="usuario"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Usuário
            </label>

            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="Digite seu usuário"
              value={formData.usuario}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  usuario: event.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label
              htmlFor="senha"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Senha
            </label>

            <input
              id="senha"
              name="senha"
              type="password"
              placeholder="Digite sua senha"
              value={formData.senha}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  senha: event.target.value,
                })
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Acesso restrito à administração acadêmica
        </p>
      </section>
    </main>
  )
}