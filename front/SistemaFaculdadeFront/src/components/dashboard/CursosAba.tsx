// components/dashboard/CursosAba.tsx

import { useState } from 'react';
import { ModalEditarCurso, ModalCursoState } from '../../modais/ModalEditarCurso';

interface Props {
  token: string;
  cursos: any[];
  onRecarregar: () => void;
}

export function CursosAba({ token, cursos, onRecarregar }: Props) {
  const [nomeCursoEnum, setNomeCursoEnum] = useState('0');
  const [tempoMeses, setTempoMeses] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [campus, setCampus] = useState('');
  const [coordIds, setCoordIds] = useState('');
  const [modal, setModal] = useState<ModalCursoState | null>(null);

  async function criarCurso() {
    const ids = coordIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const res = await fetch('http://localhost:5043/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        nomeCursoEnum: parseInt(nomeCursoEnum) || 0,
        tempoDoCursoEmMeses: parseInt(tempoMeses) || 0,
        dataInicio: dataInicio || new Date().toISOString(),
        dataFim: dataFim || new Date().toISOString(),
        campus,
        coordenadorIds: ids,
      }),
    });
    if (!res.ok) return alert('❌ ERRO: ' + (await res.json()).message);
    setNomeCursoEnum('0'); setTempoMeses(''); setDataInicio(''); setDataFim(''); setCampus(''); setCoordIds('');
    onRecarregar();
  }

  async function deletar(id: number) {
    if (!window.confirm(`Excluir curso #${id}?`)) return;
    const res = await fetch(`http://localhost:5043/api/cursos/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) alert('❌ Banco bloqueou a exclusão. Registro vinculado a outra tabela.');
    onRecarregar();
  }

  async function salvarEdicao() {
    if (!modal) return;
    const ids = modal.coordenadorIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    const res = await fetch(`http://localhost:5043/api/cursos/${modal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        id: modal.id,
        nomeCursoEnum: parseInt(modal.nomeCursoEnum) || 0,
        tempoDoCursoEmMeses: parseInt(modal.tempoDoCursoEmMeses) || 0,
        dataInicio: modal.dataInicio || new Date().toISOString(),
        dataFim: modal.dataFim || new Date().toISOString(),
        campus: modal.campus,
        coordenadorIds: ids,
      }),
    });
    if (!res.ok) return alert('❌ ERRO: ' + ((await res.json()).message || 'Verifique os dados.'));
    setModal(null);
    onRecarregar();
  }

  function abrirModal(c: any) {
    setModal({
      id: c.id,
      nomeCursoEnum: c.nomeCursoEnum?.toString() || '0',
      tempoDoCursoEmMeses: c.tempoEmMeses?.toString() || '',
      dataInicio: c.dataInicio ? c.dataInicio.substring(0, 10) : '',
      dataFim: c.dataFim ? c.dataFim.substring(0, 10) : '',
      campus: c.campus || '',
      coordenadorIds: (c.coordenadores || []).map((coord: any) => coord.id).join(', '),
    });
  }

  return (
    <div>
      <div className="admin-panel">
        <h3>Novo Curso</h3>
        <div className="form-grid">
          <div className="full-width">
            <label className="field-label">Curso</label>
            <select className="input-field" value={nomeCursoEnum} onChange={e => setNomeCursoEnum(e.target.value)}>
              <option value="0">Sistemas de Informação</option>
              <option value="1">Engenharia de Software</option>
              <option value="2">Ciência da Computação</option>
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
        {cursos.length > 0 ? cursos.map(c => (
          <li className="list-item" key={c.id}>
            <div className="list-item-info">
              <span className="list-item-id">ID {c.id}</span>
              <span className="list-item-name">{c.nomeCurso || `Curso Enum: ${c.nomeCursoEnum}`}</span>
              <span className="list-item-sub">Campus: {c.campus}</span>
            </div>
            <div className="list-item-actions">
              <button className="btn-edit" onClick={() => abrirModal(c)}>✏️ Editar</button>
              <button className="btn-danger" onClick={() => deletar(c.id)}>🗑️</button>
            </div>
          </li>
        )) : <li className="list-empty">Nenhum curso visível para o seu usuário.</li>}
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