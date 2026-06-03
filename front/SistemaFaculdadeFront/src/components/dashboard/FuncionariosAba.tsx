// components/dashboard/FuncionariosAba.tsx

import { useState } from 'react';
import { ModalEditarFuncionario, ModalFuncionarioState } from '../../modais/ModalEditarFuncionario';

interface Props {
  token: string;
  funcionarios: any[];
  onRecarregar: () => void;
}

export function FuncionariosAba({ token, funcionarios, onRecarregar }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('Professor');
  const [departamento, setDepartamento] = useState('TI');
  const [modal, setModal] = useState<ModalFuncionarioState | null>(null);

  async function criarFuncionario() {
    const res = await fetch('http://localhost:5043/api/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ nome, email, cargo, departamento }),
    });
    if (!res.ok) return alert('❌ ERRO: ' + (await res.json()).message);
    setNome(''); setEmail('');
    onRecarregar();
  }

  async function deletar(id: number) {
    if (!window.confirm(`Excluir funcionário #${id}?`)) return;
    const res = await fetch(`http://localhost:5043/api/funcionarios/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) alert('❌ Banco bloqueou a exclusão. Registro vinculado a outra tabela.');
    onRecarregar();
  }

  async function salvarEdicao() {
    if (!modal) return;
    const res = await fetch(`http://localhost:5043/api/funcionarios/${modal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        id: modal.id,
        nome: modal.nome,
        email: modal.email,
        cargo: modal.cargo,
        departamento: modal.departamento,
        senha: 'faculdade123',
      }),
    });
    if (!res.ok) return alert('❌ ERRO: ' + ((await res.json()).message || 'Verifique os dados.'));
    setModal(null);
    onRecarregar();
  }

  function abrirModal(f: any) {
    setModal({
      id: f.id,
      nome: f.nome || '',
      email: f.email || '',
      cargo: f.cargo || 'Professor',
      departamento: f.departamento || '',
    });
  }

  return (
    <div>
      <div className="admin-panel">
        <h3>Novo Funcionário</h3>
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
            <label className="field-label">Departamento</label>
            <input className="input-field" value={departamento} onChange={e => setDepartamento(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Cargo</label>
            <select className="input-field" value={cargo} onChange={e => setCargo(e.target.value)}>
              <option value="Professor">Professor</option>
              <option value="Coordenador">Coordenador</option>
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={criarFuncionario}>Salvar Funcionário</button>
      </div>

      <p className="section-title">Equipe</p>
      <ul className="list-group">
        {funcionarios.length > 0 ? funcionarios.map(f => (
          <li className="list-item" key={f.id}>
            <div className="list-item-info">
              <span className="list-item-id">ID {f.id}</span>
              <span className="list-item-name">{f.nome}</span>
              <span className="list-item-sub">{f.cargo} · {f.email}</span>
            </div>
            {f.id !== 1 && (
              <div className="list-item-actions">
                <button className="btn-edit" onClick={() => abrirModal(f)}>✏️ Editar</button>
                <button className="btn-danger" onClick={() => deletar(f.id)}>🗑️</button>
              </div>
            )}
          </li>
        )) : <li className="list-empty">Nenhum funcionário carregado.</li>}
      </ul>

      {modal && (
        <ModalEditarFuncionario
          dados={modal}
          onChange={setModal}
          onSalvar={salvarEdicao}
          onFechar={() => setModal(null)}
        />
      )}
    </div>
  );
}