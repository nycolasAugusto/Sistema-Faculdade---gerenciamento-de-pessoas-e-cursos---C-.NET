import { useState, useEffect } from 'react';

interface DashboardProps {
  token: string;
  perfil: string;
  usuarioId: string;
  setToken: (token: string) => void;
}

export function Dashboard({ token, perfil, usuarioId, setToken }: DashboardProps) {
  const [abaAtual, setAbaAtual] = useState('turmas'); 
  const isAdmin = perfil === 'Coordenador' || perfil === 'Gestor';

  const [turmas, setTurmas] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);

  const [nomeTurma, setNomeTurma] = useState('');
  
  const [nomeAluno, setNomeAluno] = useState('');
  const [matriculaAluno, setMatriculaAluno] = useState('');
  
  const [nomeCurso, setNomeCurso] = useState('');
  const [campusCurso, setCampusCurso] = useState('');
  
  const [nomeFunc, setNomeFunc] = useState('');
  const [emailFunc, setEmailFunc] = useState('');
  const [cargoFunc, setCargoFunc] = useState('Professor');
  const [deptoFunc, setDeptoFunc] = useState('TI');

  // Só useEffect, useState e chamadas de fetch
  useEffect(() => {
    if (abaAtual === 'turmas') carregarTurmas();
    if (abaAtual === 'alunos' && isAdmin) carregarAlunos();
    if (abaAtual === 'cursos' && isAdmin) carregarCursos();
    if (abaAtual === 'funcionarios' && isAdmin) carregarFuncionarios();
  }, [abaAtual]);

  async function carregarTurmas() {
    const response = await fetch('http://localhost:5043/api/turmas', { headers: { 'Authorization': `Bearer ${token}` } });
    if (response.ok) setTurmas(await response.json());
  }

  async function carregarAlunos() {
    const response = await fetch('http://localhost:5043/api/alunos', { headers: { 'Authorization': `Bearer ${token}` } });
    if (response.ok) setAlunos(await response.json());
  }

  async function carregarCursos() {
    const response = await fetch('http://localhost:5043/api/cursos', { headers: { 'Authorization': `Bearer ${token}` } });
    if (response.ok) setCursos(await response.json());
  }

  async function carregarFuncionarios() {
    const response = await fetch('http://localhost:5043/api/funcionarios', { headers: { 'Authorization': `Bearer ${token}` } });
    if (response.ok) setFuncionarios(await response.json());
  }

  async function criarTurma() {
    await fetch('http://localhost:5043/api/turmas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome: nomeTurma }) 
    });
    setNomeTurma('');
    carregarTurmas(); 
  }

  async function editarTurma(id: number, nomeAtual: string) {
    const novoNome = prompt('Alterar o nome da turma:', nomeAtual);
    
    if (novoNome && novoNome !== nomeAtual) {
      await fetch(`http://localhost:5043/api/turmas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id: id, nome: novoNome }) 
      });
      carregarTurmas();
    }
  }

  async function criarAluno() {
    await fetch('http://localhost:5043/api/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome: nomeAluno, matricula: matriculaAluno }) 
    });
    setNomeAluno(''); setMatriculaAluno('');
    carregarAlunos();
  }

  async function criarCurso() {
    await fetch('http://localhost:5043/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome: nomeCurso, campus: campusCurso }) 
    });
    setNomeCurso(''); setCampusCurso('');
    carregarCursos();
  }

  async function criarFuncionario() {
    await fetch('http://localhost:5043/api/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome: nomeFunc, email: emailFunc, cargo: cargoFunc, departamento: deptoFunc }) 
    });
    setNomeFunc(''); setEmailFunc('');
    carregarFuncionarios();
  }

  function sairDaConta() {
    setToken(''); 
  }

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>Painel do {perfil}</h2>
        <button className="btn-danger" onClick={sairDaConta}>Sair</button>
      </div>

      <div className="tab-menu">
        <button className="btn-tab tab-turmas" onClick={() => setAbaAtual('turmas')}>Turmas</button>
        {isAdmin && (
          <>
            <button className="btn-tab tab-alunos" onClick={() => setAbaAtual('alunos')}>Alunos</button>
            <button className="btn-tab tab-cursos" onClick={() => setAbaAtual('cursos')}>Cursos</button>
            <button className="btn-tab tab-funcionarios" onClick={() => setAbaAtual('funcionarios')}>Funcionários</button>
          </>
        )}
      </div>

      {abaAtual === 'turmas' && (
        <div>
          {isAdmin && (
            <div className="admin-panel">
              <h3>Nova Turma</h3>
              <input className="input-field" placeholder="Nome da Turma" value={nomeTurma} onChange={e => setNomeTurma(e.target.value)} />
              <button className="btn-primary" onClick={criarTurma}>Salvar Turma</button>
            </div>
          )}
          <h3>Lista de Turmas</h3>
          <ul className="list-group">
            {turmas.map(t => (
              <li className="list-item" key={t.id}>
                <strong>{t.nome}</strong>
                <button className="btn-edit" onClick={() => editarTurma(t.id, t.nome)}>
                  ✏️ Editar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {abaAtual === 'alunos' && isAdmin && (
        <div>
          <div className="admin-panel">
            <h3>Novo Aluno</h3>
            <input className="input-field" placeholder="Nome" value={nomeAluno} onChange={e => setNomeAluno(e.target.value)} />
            <input className="input-field" placeholder="Matrícula" value={matriculaAluno} onChange={e => setMatriculaAluno(e.target.value)} />
            <button className="btn-primary" onClick={criarAluno}>Salvar Aluno</button>
          </div>
          <h3>Lista de Alunos</h3>
          <ul className="list-group">
            {alunos.map(a => <li className="list-item" key={a.id}>{a.nome} - {a.matricula}</li>)}
          </ul>
        </div>
      )}

      {abaAtual === 'cursos' && isAdmin && (
        <div>
          <div className="admin-panel">
            <h3>Novo Curso</h3>
            <input className="input-field" placeholder="Nome do Curso" value={nomeCurso} onChange={e => setNomeCurso(e.target.value)} />
            <input className="input-field" placeholder="Campus" value={campusCurso} onChange={e => setCampusCurso(e.target.value)} />
            <button className="btn-primary" onClick={criarCurso}>Salvar Curso</button>
          </div>
          <h3>Lista de Cursos</h3>
          <ul className="list-group">
            {cursos.map(c => <li className="list-item" key={c.id}>{c.nome} - Campus: {c.campus}</li>)}
          </ul>
        </div>
      )}

      {abaAtual === 'funcionarios' && isAdmin && (
        <div>
          <div className="admin-panel">
            <h3>Novo Funcionário</h3>
            <input className="input-field" placeholder="Nome" value={nomeFunc} onChange={e => setNomeFunc(e.target.value)} />
            <input className="input-field" placeholder="E-mail" value={emailFunc} onChange={e => setEmailFunc(e.target.value)} />
            <input className="input-field" placeholder="Departamento" value={deptoFunc} onChange={e => setDeptoFunc(e.target.value)} />
            <select className="input-field" value={cargoFunc} onChange={e => setCargoFunc(e.target.value)}>
              <option value="Professor">Professor</option>
              <option value="Coordenador">Coordenador</option>
            </select>
            <button className="btn-primary" onClick={criarFuncionario}>Salvar Funcionário</button>
          </div>
          <h3>Equipe</h3>
          <ul className="list-group">
            {funcionarios.map(f => <li className="list-item" key={f.id}>{f.nome} ({f.cargo}) - {f.email}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}