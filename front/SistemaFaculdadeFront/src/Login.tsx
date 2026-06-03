import { FormEvent, useState } from 'react';

interface LoginProps {
  setToken: (token: string) => void;
  setPerfil: (perfil: string) => void;
  setUsuarioId: (id: string) => void;
}

// Estilos inline para não depender de classes do dashboard.css
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: '#0f1117',
  border: '1px solid #2a3050',
  borderRadius: '10px',
  color: '#eaedf5',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '0.93rem',
  marginBottom: '12px',
  outline: 'none',
};

const btnStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: '#f5a623',
  color: '#0f1117',
  border: 'none',
  borderRadius: '10px',
  fontFamily: "'Syne', sans-serif",
  fontWeight: 700,
  fontSize: '0.95rem',
  cursor: 'pointer',
  marginTop: '6px',
  letterSpacing: '0.3px',
};

export function Login({ setToken, setPerfil, setUsuarioId }: LoginProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro('');
    try {
      const response = await fetch('http://localhost:5043/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario, senha: senha }),
      });

      if (!response.ok) throw new Error('E-mail ou senha incorretos.');

      const data = await response.json();
      setToken(data.token);
      setPerfil(data.perfil);
      setUsuarioId(data.usuarioId.toString());
    } catch (error: any) {
      setErro(error.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sistema <span>Acadêmico</span></h2>

        {erro && <p>{erro}</p>}

        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="email"
            placeholder="E-mail de acesso"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
            required
          />
          <input
            style={inputStyle}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={e => setSenha(e.target.value)}
            required
          />
          <button style={btnStyle} type="submit">Entrar no Sistema</button>
        </form>
      </div>
    </div>
  );
}