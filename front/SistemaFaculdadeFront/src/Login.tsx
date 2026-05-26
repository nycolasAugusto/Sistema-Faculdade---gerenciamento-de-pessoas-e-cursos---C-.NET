import { FormEvent, useState } from 'react';

// Avisando ao TypeScript o que esse componente vai receber
interface LoginProps {
  setToken: (token: string) => void;
  setPerfil: (perfil: string) => void;
  setUsuarioId: (id: string) => void;
}

export function Login({ setToken, setPerfil, setUsuarioId }: LoginProps) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5043/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: usuario, senha: senha })
      });

      if (!response.ok) throw new Error('E-mail ou senha incorretos');

      const data = await response.json();
      
      // Atualiza o estado lá no App.tsx. Isso faz a tela mudar na hora!
      setToken(data.token);
      setPerfil(data.perfil);
      setUsuarioId(data.usuarioId);
      
    } catch (error: any) {
      setErro(error.message);
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Login</h1>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      
      <form onSubmit={handleSubmit}>
        <input 
          placeholder="E-mail" 
          value={usuario} 
          onChange={(e) => setUsuario(e.target.value)} 
        />
        <br/><br/>
        <input 
          type="password" 
          placeholder="Senha" 
          value={senha} 
          onChange={(e) => setSenha(e.target.value)} 
        />
        <br/><br/>
        <button type="submit">Entrar no Sistema</button>
      </form>
    </div>
  );
}