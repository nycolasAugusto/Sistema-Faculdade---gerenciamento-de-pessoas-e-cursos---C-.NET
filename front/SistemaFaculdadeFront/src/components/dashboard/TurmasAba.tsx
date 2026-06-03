// components/dashboard/TurmasAba.tsx

import { useState } from 'react';
import { ModalEditarTurma, ModalTurmaState } from '../../modais/ModalEditarTurma';

interface Props {
  token: string;
  isAdmin: boolean;
  isProfessor: boolean;
  turmas: any[];
  onRecarregar: () => void;
}

export function TurmasAba({ token, isAdmin, isProfessor, turmas, onRecarregar }: Props) {
  // form criação
  const [nome, setNome] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [professorId, setProfessorId] = useState('');
  const [cursosIds, setCursosIds] = useState('');

  // modal edição
  const [modal, setModal] = useState<ModalTurmaState | null>(null);

  async function criarTurma() {
    const ids = cursosIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const res = await fetch('http://localhost:5043/api/turmas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        nome,
        dataInicio: dataInicio || new Date().toISOString(),
        dataFim: dataFim || new Date().toISOString(),
        professorId: parseInt(professorId) || 0,
        cursosIds: ids,
      }),
    });
    if (!res.ok) return alert('❌ ERRO: ' + (await res.json()).message);
    setNome(''); setDataInicio(''); setDataFim(''); setProfessorId(''); setCursosIds('');
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
    const ids = modal.cursosIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const res = await fetch(`http://localhost:5043/api/turmas/${modal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        id: modal.id,
        nome: modal.nome,
        professorId: parseInt(modal.professorId) || 0,
        cursosIds: ids,
        emAndamento: modal.emAndamento,
      }),
    });
    if (!res.ok) return alert('❌ ERRO: ' + ((await res.json()).message || 'Verifique os dados.'));
    setModal(null);
    onRecarregar();
  }

  function abrirModal(t: any) {
    setModal({
      id: t.id,
      nome: t.nome || '',
      professorId: t.professorId?.toString() || '',
      cursosIds: '',
      emAndamento: t.emAndamento || false,
    });
  }

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
              <label className="field-label">ID do Professor</label>
              <input className="input-field" type="number" value={professorId} onChange={e => setProfessorId(e.target.value)} />
            </div>
            <div>
              <label className="field-label">IDs dos Cursos (ex: 1, 2)</label>
              <input className="input-field" value={cursosIds} onChange={e => setCursosIds(e.target.value)} />
            </div>
          </div>
          <button className="btn-primary" onClick={criarTurma}>Salvar Turma</button>
        </div>
      )}

      <p className="section-title">Lista de Turmas</p>
      <ul className="list-group">
        {turmas.length > 0 ? turmas.map(t => (
          <li className="list-item" key={t.id}>
            <div className="list-item-info">
              <span className="list-item-id">ID {t.id}</span>
              <span className="list-item-name">{t.nome}</span>
              {t.professorNome && <span className="list-item-sub">Prof. {t.professorNome}</span>}
            </div>
            <div className="list-item-actions">
              {(isAdmin || isProfessor) && (
                <button className="btn-edit" onClick={() => abrirModal(t)}>✏️ Editar</button>
              )}
              {isAdmin && (
                <button className="btn-danger" onClick={() => deletar(t.id)}>🗑️</button>
              )}
            </div>
          </li>
        )) : <li className="list-empty">Nenhuma turma carregada.</li>}
      </ul>

      {modal && (
        <ModalEditarTurma
          dados={modal}
          onChange={setModal}
          onSalvar={salvarEdicao}
          onFechar={() => setModal(null)}
        />
      )}
    </div>
  );
}