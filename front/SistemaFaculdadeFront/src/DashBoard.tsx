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

  // --- LISTAS ---
  const [turmas, setTurmas] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);

  const [nomeTurma, setNomeTurma] = useState('');
  const [dataInicioTurma, setDataInicioTurma] = useState('');
  const [dataFimTurma, setDataFimTurma] = useState('');
  const [professorIdTurma, setProfessorIdTurma] = useState('');
  const [cursosIdsTurma, setCursosIdsTurma] = useState(''); 

  const [nomeAluno, setNomeAluno] = useState('');
  const [emailAluno, setEmailAluno] = useState('');
  const [cursoIdAluno, setCursoIdAluno] = useState('');
  const [periodoAluno, setPeriodoAluno] = useState('');

  const [nomeCursoEnum, setNomeCursoEnum] = useState('0'); 
  const [tempoMesesCurso, setTempoMesesCurso] = useState('');
  const [dataInicioCurso, setDataInicioCurso] = useState('');
  const [dataFimCurso, setDataFimCurso] = useState('');
  const [campusCurso, setCampusCurso] = useState('');
  const [coordenadoresIdsCurso, setCoordenadoresIdsCurso] = useState(''); 

  const [nomeFunc, setNomeFunc] = useState('');
  const [emailFunc, setEmailFunc] = useState('');
  const [cargoFunc, setCargoFunc] = useState('Professor');
  const [deptoFunc, setDeptoFunc] = useState('TI');

  useEffect(() => {
    carregarTudo();
  }, [abaAtual]);

  // ==========================================
  // BUSCAS (GET) COM A REGRA DE NEGÓCIO APLICADA
  // ==========================================
  async function carregarTudo() {
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    
    try {
      const resTurmas = await fetch('http://localhost:5043/api/turmas', config);
      if (resTurmas.ok) setTurmas(await resTurmas.json());
    } catch (e) { console.error(e); }

    if (isAdmin) {
      try {
        const resAlunos = await fetch('http://localhost:5043/api/alunos', config);
        if (resAlunos.ok) setAlunos(await resAlunos.json());
      } catch (e) { console.error(e); }

      try {
        const resCursos = await fetch('http://localhost:5043/api/cursos', config);
        if (resCursos.ok) {
          const todosCursos = await resCursos.json();
          
          // A MÁGICA DA REGRA DE NEGÓCIO ACONTECE AQUI:
          if (perfil === 'Coordenador') {
            // Se for Coordenador, filtra a lista antes de salvar no estado (useState)
            const meusCursos = todosCursos.filter((c: any) => 
              c.coordenadores && c.coordenadores.some((coord: any) => coord.id === parseInt(usuarioId))
            );
            setCursos(meusCursos);
          } else {
            // Se for Gestor (Admin), joga a lista completa na tela
            setCursos(todosCursos);
          }
        }
      } catch (e) { console.error(e); }

      try {
        const resFuncs = await fetch('http://localhost:5043/api/funcionarios', config);
        if (resFuncs.ok) setFuncionarios(await resFuncs.json());
      } catch (e) { console.error(e); }
    }
  }

  // ==========================================
  // CRIAÇÃO (POST)
  // ==========================================
  async function criarTurma() {
    const idsCursosArray = cursosIdsTurma.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const response = await fetch('http://localhost:5043/api/turmas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ 
        nome: nomeTurma,
        dataInicio: dataInicioTurma || new Date().toISOString(),
        dataFim: dataFimTurma || new Date().toISOString(),
        professorId: parseInt(professorIdTurma) || 0,
        cursosIds: idsCursosArray
      }) 
    });

    if (!response.ok) return alert("❌ ERRO: " + (await response.json()).message);
    setNomeTurma(''); setDataInicioTurma(''); setDataFimTurma(''); setProfessorIdTurma(''); setCursosIdsTurma('');
    carregarTudo(); 
  }

  async function criarAluno() {
    const response = await fetch('http://localhost:5043/api/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ 
        nome: nomeAluno, 
        email: emailAluno,
        cursoId: parseInt(cursoIdAluno) || 0,
        periodo: parseInt(periodoAluno) || 1
      }) 
    });

    if (!response.ok) return alert("❌ ERRO: " + (await response.json()).message);
    setNomeAluno(''); setEmailAluno(''); setCursoIdAluno(''); setPeriodoAluno('');
    carregarTudo();
  }

  async function criarCurso() {
    const idsCoordArray = coordenadoresIdsCurso.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const response = await fetch('http://localhost:5043/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ 
        nomeCursoEnum: parseInt(nomeCursoEnum) || 0,
        tempoDoCursoEmMeses: parseInt(tempoMesesCurso) || 0,
        dataInicio: dataInicioCurso || new Date().toISOString(),
        dataFim: dataFimCurso || new Date().toISOString(),
        campus: campusCurso,
        coordenadorIds: idsCoordArray
      }) 
    });

    if (!response.ok) return alert("❌ ERRO: " + (await response.json()).message);
    setNomeCursoEnum('0'); setTempoMesesCurso(''); setDataInicioCurso(''); setDataFimCurso(''); setCampusCurso(''); setCoordenadoresIdsCurso('');
    carregarTudo();
  }

  async function criarFuncionario() {
    const response = await fetch('http://localhost:5043/api/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome: nomeFunc, email: emailFunc, cargo: cargoFunc, departamento: deptoFunc }) 
    });

    if (!response.ok) return alert("❌ ERRO: " + (await response.json()).message);
    setNomeFunc(''); setEmailFunc('');
    carregarTudo();
  }

  // ==========================================
  // EDIÇÃO E EXCLUSÃO (PUT / DELETE)
  // ==========================================
  async function deletarEntidade(endpoint: string, id: number) {
    if (window.confirm(`Tem certeza que deseja excluir o registro #${id}?`)) {
      const response = await fetch(`http://localhost:5043/api/${endpoint}/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) alert("❌ O Banco bloqueou a exclusão. Provavelmente este registro está vinculado a outra tabela.");
      carregarTudo();
    }
  }

  async function editarEntidade(endpoint: string, id: number, nomeAtual: string, payloadBase: any) {
    const novoNome = prompt(`Alterar nome do registro #${id}:`, nomeAtual);
    if (novoNome && novoNome !== nomeAtual) {
      const body = { ...payloadBase, id: id, nome: novoNome };
      
      const response = await fetch(`http://localhost:5043/api/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const erro = await response.json();
        alert("❌ ERRO AO EDITAR: " + (erro.message || "Verifique os dados exigidos pelo DTO."));
      }
      carregarTudo();
    }
  }

  function sairDaConta() { setToken(''); }

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

      {/* ABA DE TURMAS */}
      {abaAtual === 'turmas' && (
        <div>
          {isAdmin && (
            <div className="admin-panel">
              <h3>Nova Turma</h3>
              <input className="input-field" placeholder="Nome da Turma" value={nomeTurma} onChange={e => setNomeTurma(e.target.value)} />
              <input className="input-field" type="date" placeholder="Data Início" value={dataInicioTurma} onChange={e => setDataInicioTurma(e.target.value)} />
              <input className="input-field" type="date" placeholder="Data Fim" value={dataFimTurma} onChange={e => setDataFimTurma(e.target.value)} />
              <input className="input-field" type="number" placeholder="ID do Professor" value={professorIdTurma} onChange={e => setProfessorIdTurma(e.target.value)} />
              <input className="input-field" placeholder="IDs dos Cursos (ex: 1, 2)" value={cursosIdsTurma} onChange={e => setCursosIdsTurma(e.target.value)} />
              <button className="btn-primary" onClick={criarTurma}>Salvar Turma</button>
            </div>
          )}
          <h3>Lista de Turmas</h3>
          <ul className="list-group">
            {turmas.length > 0 ? turmas.map(t => (
              <li className="list-item" key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>[ID: {t.id}]</strong> {t.nome}</span>
                <div>
                  <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => editarEntidade('turmas', t.id, t.nome, { professorId: 0, cursosIds: [], emAndamento: true })}>✏️ Editar</button>
                  {isAdmin && <button className="btn-danger" onClick={() => deletarEntidade('turmas', t.id)}>🗑️</button>}
                </div>
              </li>
            )) : <li className="list-item">Nenhuma turma carregada.</li>}
          </ul>
        </div>
      )}

      {/* ABA DE ALUNOS */}
      {abaAtual === 'alunos' && isAdmin && (
        <div>
          <div className="admin-panel">
            <h3>Novo Aluno</h3>
            <input className="input-field" placeholder="Nome" value={nomeAluno} onChange={e => setNomeAluno(e.target.value)} />
            <input className="input-field" placeholder="E-mail" value={emailAluno} onChange={e => setEmailAluno(e.target.value)} />
            <input className="input-field" type="number" placeholder="ID do Curso" value={cursoIdAluno} onChange={e => setCursoIdAluno(e.target.value)} />
            <input className="input-field" type="number" placeholder="Período" value={periodoAluno} onChange={e => setPeriodoAluno(e.target.value)} />
            <button className="btn-primary" onClick={criarAluno}>Salvar Aluno</button>
          </div>
          <h3>Lista de Alunos</h3>
          <ul className="list-group">
            {alunos.length > 0 ? alunos.map(a => (
              <li className="list-item" key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>[ID: {a.id}]</strong> {a.nome} - {a.email}</span>
                <div>
                  <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => editarEntidade('alunos', a.id, a.nome, { email: a.email, cursoId: 0, periodo: 1 })}>✏️ Editar</button>
                  <button className="btn-danger" onClick={() => deletarEntidade('alunos', a.id)}>🗑️</button>
                </div>
              </li>
            )) : <li className="list-item">Nenhum aluno carregado.</li>}
          </ul>
        </div>
      )}

      {/* ABA DE CURSOS */}
      {abaAtual === 'cursos' && isAdmin && (
        <div>
          <div className="admin-panel">
            <h3>Novo Curso</h3>
            <select className="input-field" value={nomeCursoEnum} onChange={e => setNomeCursoEnum(e.target.value)}>
              <option value="0">Sistemas de Informação</option>
              <option value="1">Engenharia de Software</option>
              <option value="2">Ciência da Computação</option>
            </select>
            <input className="input-field" type="number" placeholder="Tempo de Curso (Meses)" value={tempoMesesCurso} onChange={e => setTempoMesesCurso(e.target.value)} />
            <input className="input-field" type="date" placeholder="Data Início" value={dataInicioCurso} onChange={e => setDataInicioCurso(e.target.value)} />
            <input className="input-field" type="date" placeholder="Data Fim" value={dataFimCurso} onChange={e => setDataFimCurso(e.target.value)} />
            <input className="input-field" placeholder="Campus" value={campusCurso} onChange={e => setCampusCurso(e.target.value)} />
            <input className="input-field" placeholder="IDs dos Coordenadores" value={coordenadoresIdsCurso} onChange={e => setCoordenadoresIdsCurso(e.target.value)} />
            <button className="btn-primary" onClick={criarCurso}>Salvar Curso</button>
          </div>
          <h3>Lista de Cursos</h3>
          <ul className="list-group">
            {cursos.length > 0 ? cursos.map(c => (
              <li className="list-item" key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>[ID: {c.id}]</strong> {c.nomeCurso || `Curso Enum: ${c.nomeCursoEnum}`} - Campus: {c.campus}</span>
                <button className="btn-danger" onClick={() => deletarEntidade('cursos', c.id)}>🗑️</button>
              </li>
            )) : <li className="list-item">Nenhum curso visível para o seu usuário no momento.</li>}
          </ul>
        </div>
      )}

      {/* ABA DE FUNCIONÁRIOS */}
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
            {funcionarios.length > 0 ? funcionarios.map(f => (
              <li className="list-item" key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>[ID: {f.id}]</strong> {f.nome} ({f.cargo}) - {f.email}</span>
                {f.id !== 1 && ( 
                  <div>
                    <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => editarEntidade('funcionarios', f.id, f.nome, { email: f.email, departamento: f.departamento, cargo: f.cargo })}>✏️ Editar</button>
                    <button className="btn-danger" onClick={() => deletarEntidade('funcionarios', f.id)}>🗑️</button>
                  </div>
                )}
              </li>
            )) : <li className="list-item">Nenhum funcionário carregado.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}