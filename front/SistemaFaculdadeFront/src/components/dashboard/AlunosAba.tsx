// components/dashboard/AlunosAba.tsx

import { useState } from 'react';
import { ModalEditarAluno, ModalAlunoState } from '../../modais/ModalEditarAluno';

interface Props {
  token: string;
  alunos: any[];
  onRecarregar: () => void;
}

export function AlunosAba({ token, alunos, onRecarregar }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [modal, setModal] = useState<ModalAlunoState | null>(null);

  async function criarAluno() {
    const res = await fetch('http://localhost:5043/api/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        nome, email,
        cursoId: parseInt(cursoId) || 0,
        periodo: parseInt(periodo) || 1,
      }),
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      return alert('❌ ERRO: ' + (erro.message || `Status ${res.status}`));
    }
    setNome(''); setEmail(''); setCursoId(''); setPeriodo('');
    onRecarregar();
  }

  async function deletar(id: number) {
    if (!window.confirm(`Excluir aluno #${id}?`)) return;
    const res = await fetch(`http://localhost:5043/api/alunos/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) alert('❌ Banco bloqueou a exclusão. Registro vinculado a outra tabela.');
    onRecarregar();
  }

  async function salvarEdicao() {
    if (!modal) return;
    const res = await fetch(`http://localhost:5043/api/alunos/${modal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        id:      modal.id,
        nome:    modal.nome,
        email:   modal.email,
        cursoId: parseInt(modal.cursoId) || 0,
        periodo: parseInt(modal.periodo) || 1,
        ativo:   modal.ativo,
      }),
    });
    if (!res.ok) {
      const erro = await res.json().catch(() => ({}));
      return alert('❌ ERRO: ' + (erro.message || 'Verifique os dados.'));
    }
    setModal(null);
    onRecarregar();
  }

  function abrirModal(a: any) {
    setModal({
      id:      a.id      ?? a.Id,
      nome:    a.nome    ?? a.Nome    ?? '',
      email:   a.email   ?? a.Email   ?? '',
      // CursoId agora vem no DTO — trata camelCase e PascalCase
      cursoId: (a.cursoId ?? a.CursoId ?? '').toString(),
      periodo: (a.periodo ?? a.Periodo ?? 1).toString(),
      ativo:   a.ativo   ?? a.Ativo   ?? true,
    });
  }

  return (
    <div>
      <div className="admin-panel">
        <h3>Novo Aluno</h3>
        <div className="form-grid">
          <div>
            <label className="field-label">Nome</label>
            <input className="input-field" value={nome} onChange={e => setNome(e.target.value)} />
          </div>
          <div>
            <label className="field-label">E-mail</label>
            <input className="input-field" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="field-label">ID do Curso</label>
            <input className="input-field" type="number" value={cursoId} onChange={e => setCursoId(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Período</label>
            <input className="input-field" type="number" value={periodo} onChange={e => setPeriodo(e.target.value)} />
          </div>
        </div>
        <button className="btn-primary" onClick={criarAluno}>Salvar Aluno</button>
      </div>

      <p className="section-title">Lista de Alunos</p>
      <ul className="list-group">
        {alunos.length > 0 ? alunos.map(a => {
          const id     = a.id    ?? a.Id;
          const nome   = a.nome  ?? a.Nome  ?? '';
          const email  = a.email ?? a.Email ?? '';
          const curso  = a.nomeCurso ?? a.NomeCurso ?? '';
          return (
            <li className="list-item" key={id}>
              <div className="list-item-info">
                <span className="list-item-id">ID {id}</span>
                <span className="list-item-name">{nome}</span>
                <span className="list-item-sub">{email} · {curso}</span>
              </div>
              <div className="list-item-actions">
                <button className="btn-edit" onClick={() => abrirModal(a)}>✏️ Editar</button>
                <button className="btn-danger" onClick={() => deletar(id)}>🗑️</button>
              </div>
            </li>
          );
        }) : <li className="list-empty">Nenhum aluno carregado.</li>}
      </ul>

      {modal && (
        <ModalEditarAluno
          dados={modal}
          onChange={setModal}
          onSalvar={salvarEdicao}
          onFechar={() => setModal(null)}
        />
      )}
    </div>
  );
}