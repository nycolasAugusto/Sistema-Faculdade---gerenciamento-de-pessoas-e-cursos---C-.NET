// components/dashboard/CursosAba.tsx

import { useState } from 'react';
import { ModalEditarCurso, ModalCursoState } from '../../modais/ModalEditarCurso';

// Enum real do back-end (Cursos.cs)
const NOMES_CURSO = [
  { valor: 0, label: 'Tecnologia' },
  { valor: 1, label: 'Engenharia' },
  { valor: 2, label: 'Saude' },
  { valor: 3, label: 'Administracao' },
  { valor: 4, label: 'Direito' },
  { valor: 5, label: 'Artes' },
];

interface Props {
  token: string;
  cursos: any[];
  onRecarregar: () => void;
}

export function CursosAba({ token, cursos, onRecarregar }: Props) {
  const [nomeCursoEnum, setNomeCursoEnum] = useState('0');
  const [tempoMeses, setTempoMeses]       = useState('');
  const [dataInicio, setDataInicio]       = useState('');
  const [dataFim, setDataFim]             = useState('');
  const [campus, setCampus]               = useState('');
  const [coordIds, setCoordIds]           = useState('');
  const [modal, setModal]                 = useState<ModalCursoState | null>(null);

  // ── POST ──────────────────────────────────────────────
  async function criarCurso() {
    const ids = coordIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const res = await fetch('http://localhost:5043/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        nomeCursoEnum:       parseInt(nomeCursoEnum) || 0,
        tempoDoCursoEmMeses: parseInt(tempoMeses)    || 0,
        dataInicio:          dataInicio || new Date().toISOString(),
        dataFim:             dataFim    || new Date().toISOString(),
        campus,
        coordenadorIds: ids,
      }),
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      return alert('❌ ERRO ao criar: ' + (erro.message || `Status ${res.status}`));
    }
    setNomeCursoEnum('0'); setTempoMeses(''); setDataInicio('');
    setDataFim(''); setCampus(''); setCoordIds('');
    onRecarregar();
  }

  // ── DELETE ────────────────────────────────────────────
  async function deletar(id: number) {
    if (!window.confirm(`Excluir curso #${id}?`)) return;
    const res = await fetch(`http://localhost:5043/api/cursos/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      alert('❌ ' + (erro.message || 'Banco bloqueou a exclusão.'));
    }
    onRecarregar();
  }

  // ── PUT ───────────────────────────────────────────────
  async function salvarEdicao() {
    if (!modal) return;
    const res = await fetch(`http://localhost:5043/api/cursos/${modal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        id:                  modal.id,
        nomeCursoEnum:       parseInt(modal.nomeCursoEnum) || 0,
        tempoDoCursoEmMeses: parseInt(modal.tempoDoCursoEmMeses) || 0,
        dataInicio:          modal.dataInicio || new Date().toISOString(),
        dataFim:             modal.dataFim    || new Date().toISOString(),
        campus:              modal.campus,
        coordenador:         [],
        alunos:              [],
      }),
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      return alert('❌ ERRO ao editar: ' + (erro.message || `Status ${res.status}`));
    }
    setModal(null);
    onRecarregar();
  }

  // ── ABRIR MODAL ───────────────────────────────────────
  function abrirModal(c: any) {
    setModal({
      id:                  c.id          ?? c.Id,
      nomeCursoEnum:       (c.nomeCursoEnum ?? c.NomeCursoEnum ?? 0).toString(),
      tempoDoCursoEmMeses: (c.tempoEmMeses  ?? c.TempoEmMeses  ?? 0).toString(),
      dataInicio: (c.dataInicio ?? c.DataInicio ?? '').toString().substring(0, 10),
      dataFim:    (c.dataFim    ?? c.DataFim    ?? '').toString().substring(0, 10),
      campus:     c.campus ?? c.Campus ?? '',
    });
  }

  // ── RENDER ────────────────────────────────────────────
  return (
    <div>
      <div className="admin-panel">
        <h3>Novo Curso</h3>
        <div className="form-grid">
          <div className="full-width">
            <label className="field-label">Curso</label>
            <select className="input-field" value={nomeCursoEnum} onChange={e => setNomeCursoEnum(e.target.value)}>
              {NOMES_CURSO.map(c => (
                <option key={c.valor} value={c.valor}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label">Tempo (meses)</label>
            <input className="input-field" type="number" value={tempoMeses} onChange={e => setTempoMeses(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Campus</label>
            <input className="input-field" value={campus} onChange={e => setCampus(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Data Início</label>
            <input className="input-field" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Data Fim</label>
            <input className="input-field" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
          </div>
          <div className="full-width">
            <label className="field-label">IDs dos Coordenadores (ex: 1, 2)</label>
            <input className="input-field" value={coordIds} onChange={e => setCoordIds(e.target.value)} />
          </div>
        </div>
        <button className="btn-primary" onClick={criarCurso}>Salvar Curso</button>
      </div>

      <p className="section-title">Lista de Cursos</p>
      <ul className="list-group">
        {cursos.length > 0 ? cursos.map(c => {
          const id     = c.id     ?? c.Id;
          const nome   = c.nomeCurso  ?? c.NomeCurso  ?? `Enum ${c.nomeCursoEnum ?? c.NomeCursoEnum}`;
          const campus = c.campus ?? c.Campus ?? '';
          return (
            <li className="list-item" key={id}>
              <div className="list-item-info">
                <span className="list-item-id">ID {id}</span>
                <span className="list-item-name">{nome}</span>
                <span className="list-item-sub">Campus: {campus}</span>
              </div>
              <div className="list-item-actions">
                <button className="btn-edit" onClick={() => abrirModal(c)}>✏️ Editar</button>
                <button className="btn-danger" onClick={() => deletar(id)}>🗑️</button>
              </div>
            </li>
          );
        }) : <li className="list-empty">Nenhum curso visível para o seu usuário.</li>}
      </ul>

      {modal && (
        <ModalEditarCurso
          dados={modal}
          onChange={setModal}
          onSalvar={salvarEdicao}
          onFechar={() => setModal(null)}
        />
      )}
    </div>
  );
}