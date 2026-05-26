import { useState, useEffect } from 'react';

interface DashboardProps {
  token: string;
  perfil: string;
  usuarioId: string;
  setToken: (token: string) => void;
}

export function Dashboard({ token, perfil, usuarioId, setToken }: DashboardProps) {
  const [turmas, setTurmas] = useState<any[]>([]);
  const [novaTurma, setNovaTurma] = useState('');

  useEffect(() => {
    carregarTurmas();
  }, []);

  async function carregarTurmas() {
    // Busca todas se for coordenador, ou busca por ID se for professor
    const url = perfil === 'Coordenador' 
      ? 'http://localhost:5043/api/turmas' 
      : `http://localhost:5043/api/turmas/professor/${usuarioId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const data = await response.json();
    setTurmas(data);
  }

  async function criarTurma() {
    await fetch('http://localhost:5043/api/turmas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ nome: novaTurma }) 
    });
    setNovaTurma('');
    carregarTurmas(); // Atualiza a lista após criar
  }

  function sairDaConta() {
    setToken(''); // Ao limpar o token, o App.tsx joga de volta pro Login
  }

  return (
    <div style={{ padding: '20px' }}>
      <button onClick={sairDaConta}>Sair</button>
      <h2>Bem-vindo, {perfil}</h2>

      {perfil === 'Coordenador' && (
        <div style={{ border: '1px solid black', padding: '10px', marginBottom: '20px' }}>
          <h3>Criar Turma</h3>
          <input 
            value={novaTurma} 
            onChange={(e) => setNovaTurma(e.target.value)} 
          />
          <button onClick={criarTurma}>Salvar</button>
        </div>
      )}

      <h3>{perfil === 'Coordenador' ? 'Todas as Turmas' : 'Minhas Turmas'}</h3>
      <ul>
        {turmas.map(turma => (
          <li key={turma.id}>{turma.nome}</li>
        ))}
      </ul>
    </div>
  );
}