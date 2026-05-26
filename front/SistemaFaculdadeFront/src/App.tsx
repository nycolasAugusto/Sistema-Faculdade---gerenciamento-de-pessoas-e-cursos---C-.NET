import { useState } from 'react';
import { Login } from './Login';
import { Dashboard } from './DashBoard';

export default function App() {
  // O Estado global da nossa aplicação
  const [token, setToken] = useState('');
  const [perfil, setPerfil] = useState('');
  const [usuarioId, setUsuarioId] = useState('');

  // Lógica simples: Se não tem token, mostra a tela de Login
  if (token === '') {
    return (
      <Login 
        setToken={setToken} 
        setPerfil={setPerfil} 
        setUsuarioId={setUsuarioId} 
      />
    );
  }

  // Se chegou aqui, é porque tem token. Mostra o painel passando os dados.
  return (
    <Dashboard 
      token={token} 
      perfil={perfil} 
      usuarioId={usuarioId} 
      setToken={setToken} // Passamos isso para poder fazer o "Sair da conta"
    />
  );
}