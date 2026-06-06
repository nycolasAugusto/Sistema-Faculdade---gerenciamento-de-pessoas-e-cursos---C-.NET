// components/dashboard/FuncionariosAba.tsx

import { useState } from 'react';
import { ModalEditarFuncionario, ModalFuncionarioState } from '../../modais/ModalEditarFuncionario';

// Mapa: string → número (para enviar ao C#)
const CARGO_PARA_INT: Record<string, number> = {
  Professor:             0,
  Coordenador:           1,
  Gestor:                2,
  Secretario:            3,
  Bibliotecario:         4,
  TecnicoAdministrativo: 5,
  DiretorAcademico:      6,
  Reitor:                7,
};

// Mapa inverso: número → string (o banco devolve 0,1,2... o modal precisa de "Professor")
const INT_PARA_CARGO: Record<number, string> = {
  0: 'Professor',
  1: 'Coordenador',
  2: 'Gestor',
  3: 'Secretario',
  4: 'Bibliotecario',
  5: 'TecnicoAdministrativo',
  6: 'DiretorAcademico',
  7: 'Reitor',
};

interface Props {
  token: string;
  funcionarios: any[];
  onRecarregar: () => void;
}

export function FuncionariosAba({ token, funcionarios, onRecarregar }: Props) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('Professor');
  const [departamento, setDepartamento] = useState('');
  const [modal, setModal] = useState<ModalFuncionarioState | null>(null);

  // ── POST ──────────────────────────────────────────────
  async function criarFuncionario() {
    const res = await fetch('http://localhost:5043/api/funcionarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        nome,
        email,
        cargo: CARGO_PARA_INT[cargo] ?? 0,
        departamento,
      }),
    });
    if (!res.ok) {
      if (res.status === 403) return alert('❌ Sem permissão! Apenas Gestor pode criar funcionários.');
      if (res.status === 401) return alert('❌ Sessão expirada. Faça login novamente.');
      const erro = await res.json().catch(() => ({}));
      return alert('❌ ERRO ao criar: ' + (erro.message || `Status ${res.status}`));
    }
    setNome(''); setEmail(''); setDepartamento('');
    onRecarregar();
  }

  // ── DELETE ────────────────────────────────────────────
  async function deletar(id: number) {
    if (!window.confirm(`Excluir funcionário #${id}?`)) return;
    const res = await fetch(`http://localhost:5043/api/funcionarios/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    if (!res.ok) alert('❌ Banco bloqueou a exclusão. Registro vinculado a outra tabela.');
    onRecarregar();
  }

  // ── PUT ───────────────────────────────────────────────
  async function salvarEdicao() {
    if (!modal) return;
    const original = funcionarios.find(f => (f.id ?? f.Id) === modal.id);

    // cargo no modal já é string ("Professor"), converte para int antes de enviar
    const cargoInt = CARGO_PARA_INT[modal.cargo] ?? original?.cargo ?? 0;

    const res = await fetch(`http://localhost:5043/api/funcionarios/${modal.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        id:           modal.id,
        nome:         modal.nome,
        email:        modal.email,
        cargo:        cargoInt,
        departamento: modal.departamento,
        senha:        original?.senha        || original?.Senha        || 'faculdade123',
        matricula:    original?.matricula    || original?.Matricula    || '',
        dataAdmissao: original?.dataAdmissao || original?.DataAdmissao || new Date().toISOString(),
        ativo:        original?.ativo        ?? original?.Ativo        ?? true,
      }),
    });

    if (!res.ok) {
      if (res.status === 403) return alert('❌ Sem permissão para editar.');
      const erro = await res.json().catch(() => ({}));
      return alert('❌ ERRO ao editar: ' + (erro.message || `Status ${res.status}`));
    }
    setModal(null);
    onRecarregar();
  }

  // ── ABRIR MODAL ───────────────────────────────────────
  // O banco retorna cargo como número (0,1,2...) — convertemos para string
  function abrirModal(f: any) {
    const cargoRaw = f.cargo ?? f.Cargo;
    const cargoStr = typeof cargoRaw === 'number'
      ? (INT_PARA_CARGO[cargoRaw] || 'Professor')
      : (cargoRaw || 'Professor');

    setModal({
      id:           f.id          || f.Id,
      nome:         f.nome        || f.Nome        || '',
      email:        f.email       || f.Email       || '',
      cargo:        cargoStr,
      departamento: f.departamento || f.Departamento || '',
    });
  }

  // ── RENDER ────────────────────────────────────────────
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
              <option value="Gestor">Gestor</option>
              <option value="Secretario">Secretário</option>
              <option value="Bibliotecario">Bibliotecário</option>
              <option value="TecnicoAdministrativo">Técnico Administrativo</option>
              <option value="DiretorAcademico">Diretor Acadêmico</option>
              <option value="Reitor">Reitor</option>
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
              <span className="list-item-id">ID {f.id || f.Id}</span>
              <span className="list-item-name">{f.nome || f.Nome}</span>
              <span className="list-item-sub">
                {(() => { const c = f.cargo ?? f.Cargo; return typeof c === "number" ? INT_PARA_CARGO[c] : c; })()} · {f.email || f.Email}
              </span>
            </div>
            {(f.id || f.Id) !== 1 && (
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