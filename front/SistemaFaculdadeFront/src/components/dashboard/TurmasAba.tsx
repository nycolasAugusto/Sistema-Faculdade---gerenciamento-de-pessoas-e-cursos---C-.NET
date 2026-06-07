// components/dashboard/TurmasAba.tsx

import { useState } from 'react';
import { ModalEditarTurma, ModalTurmaState } from '../../modais/ModalEditarTurma';

interface Props {
  token: string;
  isAdmin: boolean;
  isProfessor: boolean;
  turmas: any[];
  cursos: any[];
  professores: any[];
  onRecarregar: () => void;
}

export function TurmasAba({ token, isAdmin, isProfessor, turmas, cursos, professores, onRecarregar }: Props) {
  const [nome, setNome]               = useState('');
  const [dataInicio, setDataInicio]   = useState('');
  const [dataFim, setDataFim]         = useState('');
  const [professorId, setProfessorId] = useState('');
  const [cursosIds, setCursosIds]     = useState<number[]>([]);
  const [modal, setModal]             = useState<ModalTurmaState | null>(null);
  const [alunosAbertos, setAlunosAbertos] = useState<number[]>([]); // IDs das turmas expandidas

  function toggleCurso(id: number) {
    setCursosIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  }

  function toggleAlunos(id: number) {
    setAlunosAbertos(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  async function criarTurma() {
    const res = await fetch('http://localhost:5043/api/turmas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        nome,
        dataInicio: dataInicio || new Date().toISOString(),
        dataFim:    dataFim    || new Date().toISOString(),
        professorId: parseInt(professorId) || 0,
        cursosIds,
      }),
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      return alert('❌ ERRO: ' + (erro.message || `Status ${res.status}`));
    }
    setNome(''); setDataInicio(''); setDataFim(''); setProfessorId(''); setCursosIds([]);
    onRecarregar();
  }

  async function deletar(id: number) {
    if (!window.confirm(`Excluir turma #${id}?`)) return;
    const res = await fetch(`http://localhost:5043/api/turmas/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) alert('❌ Banco bloqueou a exclusão. Registro vinculado a outra tabela.');
    onRecarregar();
  }

  async function salvarEdicao() {
    if (!modal) return;
    const res = await fetch(`http://localhost:5043/api/turmas/${modal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        id:          modal.id,
        nome:        modal.nome,
        professorId: parseInt(modal.professorId) || 0,
        cursosIds:   modal.cursosIds,
        emAndamento: modal.emAndamento,
      }),
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      return alert('❌ ERRO: ' + (erro.message || 'Verifique os dados.'));
    }
    setModal(null);
    onRecarregar();
  }

  function abrirModal(t: any) {
    setModal({
      id:          t.id   ?? t.Id,
      nome:        t.nome ?? t.Nome ?? '',
      professorId: (t.professorId ?? t.ProfessorId ?? '').toString(),
      cursosIds:   [],
      emAndamento: t.emAndamento ?? t.EmAndamento ?? false,
    });
  }

  const listaProfessores = professores.filter((f: any) => {
    const cargo = f.cargo ?? f.Cargo ?? '';
    return typeof cargo === 'string' ? cargo === 'Professor' : cargo === 0;
  });

  return (
    <div>
      {isAdmin && (
        <div className="admin-panel">
          <h3>Nova Turma</h3>
          <div className="form-grid">
            <div className="full-width">
              <label className="field-label">Nome da Turma</label>
              <input className="input-field" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Data Início</label>
              <input className="input-field" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Data Fim</label>
              <input className="input-field" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
            </div>
            <div>
              <label className="field-label">Professor</label>
              <select className="input-field" value={professorId} onChange={e => setProfessorId(e.target.value)}>
                <option value="">-- Selecione --</option>
                {listaProfessores.map((f: any) => {
                  const id   = f.id   ?? f.Id;
                  const nome = f.nome ?? f.Nome ?? '';
                  return <option key={id} value={id}>{nome}</option>;
                })}
              </select>
            </div>
            <div className="full-width">
              <label className="field-label">Cursos (clique para selecionar)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {cursos.map((c: any) => {
                  const id   = c.id   ?? c.Id;
                  const nome = c.nomeCurso ?? c.NomeCurso ?? `Curso ${id}`;
                  const sel  = cursosIds.includes(id);
                  return (
                    <button key={id} type="button" onClick={() => toggleCurso(id)} style={{
                      padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
                      border: sel ? '2px solid #f5a623' : '1px solid #2a3050',
                      background: sel ? 'rgba(245,166,35,0.15)' : 'transparent',
                      color: sel ? '#f5a623' : '#8b91a8',
                      fontSize: '0.85rem', fontWeight: sel ? 700 : 400, transition: '0.15s',
                    }}>{nome}</button>
                  );
                })}
                {cursos.length === 0 && <span style={{ color: '#8b91a8', fontSize: '0.85rem' }}>Nenhum curso disponível.</span>}
              </div>
            </div>
          </div>
          <button className="btn-primary" onClick={criarTurma}>Salvar Turma</button>
        </div>
      )}

      <p className="section-title">Lista de Turmas</p>
      <ul className="list-group">
        {turmas.length > 0 ? turmas.map(t => {
          const id          = t.id          ?? t.Id;
          const nome        = t.nome        ?? t.Nome        ?? '';
          const prof        = t.professorNome ?? t.ProfessorNome ?? '';
          const emAndamento = t.emAndamento ?? t.EmAndamento ?? false;
          const alunos      = t.alunos      ?? t.Alunos      ?? [];
          const aberto      = alunosAbertos.includes(id);

          return (
            <li
              key={id}
              className="list-item"
              style={{
                flexDirection: 'column',
                alignItems: 'stretch',
                borderColor: emAndamento ? '#4caf88' : undefined,
                borderWidth: emAndamento ? '2px' : '1px',
              }}
            >
              {/* LINHA PRINCIPAL */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="list-item-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="list-item-id">ID {id}</span>
                    {emAndamento && (
                      <span style={{
                        background: 'rgba(76,175,136,0.15)',
                        color: '#4caf88',
                        border: '1px solid #4caf88',
                        borderRadius: '99px',
                        padding: '1px 10px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.5px',
                      }}>● EM ANDAMENTO</span>
                    )}
                  </div>
                  <span className="list-item-name">{nome}</span>
                  {prof && <span className="list-item-sub">Prof. {prof}</span>}
                </div>

                <div className="list-item-actions">
                  {/* Botão de listar alunos */}
                  {alunos.length > 0 && (
                    <button
                      onClick={() => toggleAlunos(id)}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: '1px solid #2a3050',
                        background: aberto ? 'rgba(245,166,35,0.1)' : 'transparent',
                        color: aberto ? '#f5a623' : '#8b91a8',
                        cursor: 'pointer',
                        fontSize: '0.82rem',
                        marginRight: '6px',
                        transition: '0.15s',
                      }}
                    >
                      {aberto ? '▲ Alunos' : `▼ Alunos (${alunos.length})`}
                    </button>
                  )}
                  {(isAdmin || isProfessor) && (
                    <button className="btn-edit" onClick={() => abrirModal(t)}>✏️ Editar</button>
                  )}
                  {isAdmin && (
                    <button className="btn-danger" onClick={() => deletar(id)}>🗑️</button>
                  )}
                </div>
              </div>

              {/* LISTA DE ALUNOS EXPANDIDA */}
              {aberto && alunos.length > 0 && (
                <div style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #2a3050',
                }}>
                  <p style={{ fontSize: '0.75rem', color: '#8b91a8', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Alunos matriculados
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {alunos.map((a: any) => {
                      const aId  = a.id        ?? a.Id;
                      const aNome = a.nome      ?? a.Nome      ?? '';
                      const aMat  = a.matricula ?? a.Matricula ?? '';
                      return (
                        <div key={aId} style={{
                          display: 'flex', justifyContent: 'space-between',
                          background: '#0f1117', borderRadius: '8px',
                          padding: '8px 14px', fontSize: '0.88rem',
                        }}>
                          <span style={{ color: '#eaedf5' }}>{aNome}</span>
                          <span style={{ color: '#8b91a8', fontSize: '0.8rem' }}>Mat: {aMat}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          );
        }) : <li className="list-empty">Nenhuma turma carregada.</li>}
      </ul>

      {modal && (
        <ModalEditarTurma
          dados={modal}
          onChange={setModal}
          onSalvar={salvarEdicao}
          onFechar={() => setModal(null)}
          cursos={cursos}
          professores={listaProfessores}
        />
      )}
    </div>
  );
}