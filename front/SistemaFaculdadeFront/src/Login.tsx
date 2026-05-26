import { FormEvent, useState } from 'react';

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
        // O C# espera receber "email" e "senha" para preencher a classe Funcionario
        body: JSON.stringify({ email: usuario, senha: senha })
      });

      if (!response.ok) throw new Error('E-mail ou senha incorretos');

      const data = await response.json();
      
      setToken(data.token);
      setPerfil(data.perfil);
      setUsuarioId(data.usuarioId);
      
    } catch (error: any) {
      setErro(error.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ marginBottom: '20px' }}>Sistema Acadêmico</h2>
        
        {erro && <p style={{ color: 'red', marginBottom: '10px' }}>{erro}</p>}
        
        <form onSubmit={handleSubmit}>
          <input 
            className="input-field"
            type="email"
            placeholder="E-mail de acesso" 
            value={usuario} 
            onChange={(e) => setUsuario(e.target.value)} 
            required
          />
          <input 
            className="input-field"
            type="password" 
            placeholder="Senha" 
            value={senha} 
            onChange={(e) => setSenha(e.target.value)} 
            required
          />
          <button className="btn-primary" type="submit">Entrar no Sistema</button>
        </form>
      </div>
    </div>
  );
}