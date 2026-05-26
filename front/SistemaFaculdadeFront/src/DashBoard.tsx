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
    // Gestor e Coordenador veem tudo. Professor vê apenas as próprias.
    const url = (perfil === 'Coordenador' || perfil === 'Gestor') 
      ? 'http://localhost:5043/api/turmas' 
      : `http://localhost:5043/api/turmas/professor/${usuarioId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (response.ok) {
      const data = await response.json();
      setTurmas(data);
    }
  }

  async function criarTurma() {
    if (!novaTurma) return;

    await fetch('http://localhost:5043/api/turmas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ nome: novaTurma }) 
    });
    setNovaTurma('');
    carregarTurmas(); 
  }

  function sairDaConta() {
    setToken(''); 
  }

  // Verifica se o usuário tem privilégios administrativos
  const isAdmin = perfil === 'Coordenador' || perfil === 'Gestor';

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Bem-vindo, {perfil}</h2>
        <button className="btn-danger" onClick={sairDaConta}>Sair do Sistema</button>
      </div>

      {isAdmin && (
        <div className="admin-panel">
          <h3 style={{ marginBottom: '15px' }}>Administração Rápida</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              className="input-field"
              style={{ margin: 0 }}
              placeholder="Nome da nova Turma..."
              value={novaTurma} 
              onChange={(e) => setNovaTurma(e.target.value)} 
            />
            <button className="btn-primary" style={{ margin: 0, width: 'auto', padding: '0 20px' }} onClick={criarTurma}>
              Salvar
            </button>
          </div>
        </div>
      )}

      <h3>{isAdmin ? 'Visão Geral das Turmas' : 'Minhas Turmas Atribuídas'}</h3>
      <ul className="list-group" style={{ marginTop: '10px' }}>
        {turmas.length === 0 ? (
          <li className="list-item">Nenhuma turma encontrada.</li>
        ) : (
          turmas.map(turma => (
            <li className="list-item" key={turma.id}>
              <strong>{turma.nome}</strong> 
              <span style={{ float: 'right', color: '#666', fontSize: '0.9em' }}>
                Status: {turma.emAndamento ? 'Em Andamento' : 'Planejada'}
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}