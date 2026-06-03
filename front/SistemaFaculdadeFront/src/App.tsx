import { useState } from 'react';
import { Login } from './Login';
import { Dashboard } from './components/dashboard/Dashboard';

export default function App() {
  const [token, setToken] = useState('');
  const [perfil, setPerfil] = useState('');
  const [usuarioId, setUsuarioId] = useState('');

  if (token === '') {
    return (
      <Login
        setToken={setToken}
        setPerfil={setPerfil}
        setUsuarioId={setUsuarioId}
      />
    );
  }

  return (
    <Dashboard
      token={token}
      perfil={perfil}
      usuarioId={usuarioId}
      setToken={setToken}
    />
  );
}