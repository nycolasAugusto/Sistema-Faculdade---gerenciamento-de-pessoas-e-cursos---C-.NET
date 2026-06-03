import { useState, useEffect } from 'react';

interface DashboardProps {
  token: string;
  perfil: string;
  usuarioId: string;
  setToken: (token: string) => void;
}

// ==========================================
// TIPOS DOS MODAIS DE EDIÇÃO
// ==========================================
type ModalTurma = {
  id: number; nome: string; professorId: string; cursosIds: string; emAndamento: boolean;
};
type ModalAluno = {
  id: number; nome: string; email: string; cursoId: string; periodo: string; ativo: boolean;
};
type ModalCurso = {
  id: number; nomeCursoEnum: string; tempoDoCursoEmMeses: string;
  dataInicio: string; dataFim: string; campus: string; coordenadorIds: string;
};
type ModalFuncionario = {
  id: number; nome: string; email: string; cargo: string; departamento: string;
};

export function Dashboard({ token, perfil, usuarioId, setToken }: DashboardProps) {
  const [abaAtual, setAbaAtual] = useState('turmas');
  const isAdmin = perfil === 'Coordenador' || perfil === 'Gestor';
  const isProfessor = perfil === 'Professor';

  // --- LISTAS ---
  const [turmas, setTurmas] = useState<any[]>([]);
  const [alunos, setAlunos] = useState<any[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);

  // --- ESTADOS DE CRIAÇÃO ---
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

  // ==========================================
  // ESTADOS DOS MODAIS DE EDIÇÃO
  // ==========================================
  const [modalTurma, setModalTurma] = useState<ModalTurma | null>(null);
  const [modalAluno, setModalAluno] = useState<ModalAluno | null>(null);
  const [modalCurso, setModalCurso] = useState<ModalCurso | null>(null);
  const [modalFuncionario, setModalFuncionario] = useState<ModalFuncionario | null>(null);

  useEffect(() => {
    carregarTudo();
  }, [abaAtual]);

  // ==========================================
  // BUSCAS (GET)
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
          if (perfil === 'Coordenador') {
            setCursos(todosCursos.filter((c: any) =>
              c.coordenadores && c.coordenadores.some((coord: any) => coord.id === parseInt(usuarioId))
            ));
          } else {
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
  // EXCLUSÃO (DELETE)
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

  // ==========================================
  // SALVAR EDIÇÕES (PUT) — um por entidade
  // ==========================================
  async function salvarEdicaoTurma() {
    if (!modalTurma) return;
    const ids = modalTurma.cursosIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const body = {
      id: modalTurma.id,
      nome: modalTurma.nome,
      professorId: parseInt(modalTurma.professorId) || 0,
      cursosIds: ids,
      emAndamento: modalTurma.emAndamento
    };
    const response = await fetch(`http://localhost:5043/api/turmas/${modalTurma.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const erro = await response.json();
      return alert("❌ ERRO AO EDITAR: " + (erro.message || "Verifique os dados."));
    }
    setModalTurma(null);
    carregarTudo();
  }

  async function salvarEdicaoAluno() {
    if (!modalAluno) return;
    const body = {
      id: modalAluno.id,
      nome: modalAluno.nome,
      email: modalAluno.email,
      cursoId: parseInt(modalAluno.cursoId) || 0,
      periodo: parseInt(modalAluno.periodo) || 1,
      ativo: modalAluno.ativo
    };
    const response = await fetch(`http://localhost:5043/api/alunos/${modalAluno.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const erro = await response.json();
      return alert("❌ ERRO AO EDITAR: " + (erro.message || "Verifique os dados."));
    }
    setModalAluno(null);
    carregarTudo();
  }

  async function salvarEdicaoCurso() {
    if (!modalCurso) return;
    const ids = modalCurso.coordenadorIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    // O endpoint PUT de curso recebe o modelo Curso completo
    const body = {
      id: modalCurso.id,
      nomeCursoEnum: parseInt(modalCurso.nomeCursoEnum) || 0,
      tempoDoCursoEmMeses: parseInt(modalCurso.tempoDoCursoEmMeses) || 0,
      dataInicio: modalCurso.dataInicio || new Date().toISOString(),
      dataFim: modalCurso.dataFim || new Date().toISOString(),
      campus: modalCurso.campus,
      coordenadorIds: ids
    };
    const response = await fetch(`http://localhost:5043/api/cursos/${modalCurso.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const erro = await response.json();
      return alert("❌ ERRO AO EDITAR: " + (erro.message || "Verifique os dados."));
    }
    setModalCurso(null);
    carregarTudo();
  }

  async function salvarEdicaoFuncionario() {
    if (!modalFuncionario) return;
    const body = {
      id: modalFuncionario.id,
      nome: modalFuncionario.nome,
      email: modalFuncionario.email,
      cargo: modalFuncionario.cargo,
      departamento: modalFuncionario.departamento,
      senha: 'faculdade123' // mantém senha padrão, back não expõe a senha atual
    };
    const response = await fetch(`http://localhost:5043/api/funcionarios/${modalFuncionario.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const erro = await response.json();
      return alert("❌ ERRO AO EDITAR: " + (erro.message || "Verifique os dados."));
    }
    setModalFuncionario(null);
    carregarTudo();
  }

  // ==========================================
  // ABRIR MODAIS
  // ==========================================
  function abrirModalTurma(t: any) {
    setModalTurma({
      id: t.id,
      nome: t.nome || '',
      professorId: t.professorId?.toString() || '',
      cursosIds: '',
      emAndamento: t.emAndamento || false
    });
  }

  function abrirModalAluno(a: any) {
    setModalAluno({
      id: a.id,
      nome: a.nome || '',
      email: a.email || '',
      cursoId: a.cursoId?.toString() || '',
      periodo: a.periodo?.toString() || '1',
      ativo: a.ativo ?? true
    });
  }

  function abrirModalCurso(c: any) {
    setModalCurso({
      id: c.id,
      nomeCursoEnum: c.nomeCursoEnum?.toString() || '0',
      tempoDoCursoEmMeses: c.tempoEmMeses?.toString() || '',
      dataInicio: c.dataInicio ? c.dataInicio.substring(0, 10) : '',
      dataFim: c.dataFim ? c.dataFim.substring(0, 10) : '',
      campus: c.campus || '',
      coordenadorIds: (c.coordenadores || []).map((coord: any) => coord.id).join(', ')
    });
  }

  function abrirModalFuncionario(f: any) {
    setModalFuncionario({
      id: f.id,
      nome: f.nome || '',
      email: f.email || '',
      cargo: f.cargo || 'Professor',
      departamento: f.departamento || ''
    });
  }

  function sairDaConta() { setToken(''); }

  // ==========================================
  // ESTILOS DO MODAL (inline simples)
  // ==========================================
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.55)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };
  const modalBoxStyle: React.CSSProperties = {
    background: '#fff', borderRadius: '10px', padding: '30px',
    minWidth: '340px', maxWidth: '480px', width: '90%',
    boxShadow: '0 8px 32px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', gap: '12px'
  };
  const modalTitleStyle: React.CSSProperties = {
    fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px'
  };
  const rowStyle: React.CSSProperties = {
    display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px'
  };

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

      {/* ===================== ABA TURMAS ===================== */}
      {abaAtual === 'turmas' && (
        <div>
          {isAdmin && (
            <div className="admin-panel">
              <h3>Nova Turma</h3>
              <input className="input-field" placeholder="Nome da Turma" value={nomeTurma} onChange={e => setNomeTurma(e.target.value)} />
              <input className="input-field" type="date" value={dataInicioTurma} onChange={e => setDataInicioTurma(e.target.value)} />
              <input className="input-field" type="date" value={dataFimTurma} onChange={e => setDataFimTurma(e.target.value)} />
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
                  {/* Professor pode editar turma, admin também */}
                  {(isAdmin || isProfessor) && (
                    <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => abrirModalTurma(t)}>✏️ Editar</button>
                  )}
                  {isAdmin && (
                    <button className="btn-danger" onClick={() => deletarEntidade('turmas', t.id)}>🗑️</button>
                  )}
                </div>
              </li>
            )) : <li className="list-item">Nenhuma turma carregada.</li>}
          </ul>
        </div>
      )}

      {/* ===================== ABA ALUNOS ===================== */}
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
                  <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => abrirModalAluno(a)}>✏️ Editar</button>
                  <button className="btn-danger" onClick={() => deletarEntidade('alunos', a.id)}>🗑️</button>
                </div>
              </li>
            )) : <li className="list-item">Nenhum aluno carregado.</li>}
          </ul>
        </div>
      )}

      {/* ===================== ABA CURSOS ===================== */}
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
            <input className="input-field" type="date" value={dataInicioCurso} onChange={e => setDataInicioCurso(e.target.value)} />
            <input className="input-field" type="date" value={dataFimCurso} onChange={e => setDataFimCurso(e.target.value)} />
            <input className="input-field" placeholder="Campus" value={campusCurso} onChange={e => setCampusCurso(e.target.value)} />
            <input className="input-field" placeholder="IDs dos Coordenadores (ex: 1, 2)" value={coordenadoresIdsCurso} onChange={e => setCoordenadoresIdsCurso(e.target.value)} />
            <button className="btn-primary" onClick={criarCurso}>Salvar Curso</button>
          </div>
          <h3>Lista de Cursos</h3>
          <ul className="list-group">
            {cursos.length > 0 ? cursos.map(c => (
              <li className="list-item" key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><strong>[ID: {c.id}]</strong> {c.nomeCurso || `Curso Enum: ${c.nomeCursoEnum}`} - Campus: {c.campus}</span>
                <div>
                  <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => abrirModalCurso(c)}>✏️ Editar</button>
                  <button className="btn-danger" onClick={() => deletarEntidade('cursos', c.id)}>🗑️</button>
                </div>
              </li>
            )) : <li className="list-item">Nenhum curso visível para o seu usuário no momento.</li>}
          </ul>
        </div>
      )}

      {/* ===================== ABA FUNCIONÁRIOS ===================== */}
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
                    <button className="btn-edit" style={{ marginRight: '5px' }} onClick={() => abrirModalFuncionario(f)}>✏️ Editar</button>
                    <button className="btn-danger" onClick={() => deletarEntidade('funcionarios', f.id)}>🗑️</button>
                  </div>
                )}
              </li>
            )) : <li className="list-item">Nenhum funcionário carregado.</li>}
          </ul>
        </div>
      )}

      {/* ===================== MODAL EDITAR TURMA ===================== */}
      {modalTurma && (
        <div style={overlayStyle} onClick={() => setModalTurma(null)}>
          <div style={modalBoxStyle} onClick={e => e.stopPropagation()}>
            <span style={modalTitleStyle}>✏️ Editar Turma #{modalTurma.id}</span>

            <label>Nome</label>
            <input className="input-field" value={modalTurma.nome}
              onChange={e => setModalTurma({ ...modalTurma, nome: e.target.value })} />

            <label>ID do Professor</label>
            <input className="input-field" type="number" value={modalTurma.professorId}
              onChange={e => setModalTurma({ ...modalTurma, professorId: e.target.value })} />

            <label>IDs dos Cursos (ex: 1, 2)</label>
            <input className="input-field" value={modalTurma.cursosIds}
              onChange={e => setModalTurma({ ...modalTurma, cursosIds: e.target.value })} />

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={modalTurma.emAndamento}
                onChange={e => setModalTurma({ ...modalTurma, emAndamento: e.target.checked })} />
              Em Andamento
            </label>

            <div style={rowStyle}>
              <button className="btn-edit" onClick={salvarEdicaoTurma}>💾 Salvar</button>
              <button className="btn-danger" onClick={() => setModalTurma(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL EDITAR ALUNO ===================== */}
      {modalAluno && (
        <div style={overlayStyle} onClick={() => setModalAluno(null)}>
          <div style={modalBoxStyle} onClick={e => e.stopPropagation()}>
            <span style={modalTitleStyle}>✏️ Editar Aluno #{modalAluno.id}</span>

            <label>Nome</label>
            <input className="input-field" value={modalAluno.nome}
              onChange={e => setModalAluno({ ...modalAluno, nome: e.target.value })} />

            <label>E-mail</label>
            <input className="input-field" value={modalAluno.email}
              onChange={e => setModalAluno({ ...modalAluno, email: e.target.value })} />

            <label>ID do Curso</label>
            <input className="input-field" type="number" value={modalAluno.cursoId}
              onChange={e => setModalAluno({ ...modalAluno, cursoId: e.target.value })} />

            <label>Período</label>
            <input className="input-field" type="number" value={modalAluno.periodo}
              onChange={e => setModalAluno({ ...modalAluno, periodo: e.target.value })} />

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={modalAluno.ativo}
                onChange={e => setModalAluno({ ...modalAluno, ativo: e.target.checked })} />
              Ativo
            </label>

            <div style={rowStyle}>
              <button className="btn-edit" onClick={salvarEdicaoAluno}>💾 Salvar</button>
              <button className="btn-danger" onClick={() => setModalAluno(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL EDITAR CURSO ===================== */}
      {modalCurso && (
        <div style={overlayStyle} onClick={() => setModalCurso(null)}>
          <div style={modalBoxStyle} onClick={e => e.stopPropagation()}>
            <span style={modalTitleStyle}>✏️ Editar Curso #{modalCurso.id}</span>

            <label>Curso</label>
            <select className="input-field" value={modalCurso.nomeCursoEnum}
              onChange={e => setModalCurso({ ...modalCurso, nomeCursoEnum: e.target.value })}>
              <option value="0">Sistemas de Informação</option>
              <option value="1">Engenharia de Software</option>
              <option value="2">Ciência da Computação</option>
            </select>

            <label>Tempo (meses)</label>
            <input className="input-field" type="number" value={modalCurso.tempoDoCursoEmMeses}
              onChange={e => setModalCurso({ ...modalCurso, tempoDoCursoEmMeses: e.target.value })} />

            <label>Data Início</label>
            <input className="input-field" type="date" value={modalCurso.dataInicio}
              onChange={e => setModalCurso({ ...modalCurso, dataInicio: e.target.value })} />

            <label>Data Fim</label>
            <input className="input-field" type="date" value={modalCurso.dataFim}
              onChange={e => setModalCurso({ ...modalCurso, dataFim: e.target.value })} />

            <label>Campus</label>
            <input className="input-field" value={modalCurso.campus}
              onChange={e => setModalCurso({ ...modalCurso, campus: e.target.value })} />

            <label>IDs dos Coordenadores (ex: 1, 2)</label>
            <input className="input-field" value={modalCurso.coordenadorIds}
              onChange={e => setModalCurso({ ...modalCurso, coordenadorIds: e.target.value })} />

            <div style={rowStyle}>
              <button className="btn-edit" onClick={salvarEdicaoCurso}>💾 Salvar</button>
              <button className="btn-danger" onClick={() => setModalCurso(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL EDITAR FUNCIONÁRIO ===================== */}
      {modalFuncionario && (
        <div style={overlayStyle} onClick={() => setModalFuncionario(null)}>
          <div style={modalBoxStyle} onClick={e => e.stopPropagation()}>
            <span style={modalTitleStyle}>✏️ Editar Funcionário #{modalFuncionario.id}</span>

            <label>Nome</label>
            <input className="input-field" value={modalFuncionario.nome}
              onChange={e => setModalFuncionario({ ...modalFuncionario, nome: e.target.value })} />

            <label>E-mail</label>
            <input className="input-field" value={modalFuncionario.email}
              onChange={e => setModalFuncionario({ ...modalFuncionario, email: e.target.value })} />

            <label>Departamento</label>
            <input className="input-field" value={modalFuncionario.departamento}
              onChange={e => setModalFuncionario({ ...modalFuncionario, departamento: e.target.value })} />

            <label>Cargo</label>
            <select className="input-field" value={modalFuncionario.cargo}
              onChange={e => setModalFuncionario({ ...modalFuncionario, cargo: e.target.value })}>
              <option value="Professor">Professor</option>
              <option value="Coordenador">Coordenador</option>
            </select>

            <div style={rowStyle}>
              <button className="btn-edit" onClick={salvarEdicaoFuncionario}>💾 Salvar</button>
              <button className="btn-danger" onClick={() => setModalFuncionario(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}