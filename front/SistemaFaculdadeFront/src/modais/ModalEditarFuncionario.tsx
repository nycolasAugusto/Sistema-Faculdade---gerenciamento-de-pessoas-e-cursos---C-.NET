// components/modais/ModalEditarFuncionario.tsx

export type ModalFuncionarioState = {
  id: number;
  nome: string;
  email: string;
  cargo: string;
  departamento: string;
};

interface Props {
  dados: ModalFuncionarioState;
  onChange: (dados: ModalFuncionarioState) => void;
  onSalvar: () => void;
  onFechar: () => void;
}

export function ModalEditarFuncionario({ dados, onChange, onSalvar, onFechar }: Props) {
  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p className="modal-title">
          Editar Funcionário <span>#{dados.id}</span>
        </p>

        <div className="form-grid">
          <div>
            <label className="field-label">Nome</label>
            <input
              className="input-field"
              value={dados.nome}
              onChange={e => onChange({ ...dados, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">E-mail</label>
            <input
              className="input-field"
              value={dados.email}
              onChange={e => onChange({ ...dados, email: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Departamento</label>
            <input
              className="input-field"
              value={dados.departamento}
              onChange={e => onChange({ ...dados, departamento: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Cargo</label>
            <select
              className="input-field"
              value={dados.cargo}
              onChange={e => onChange({ ...dados, cargo: e.target.value })}
            >
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

        <div className="modal-actions">
          <button className="btn-edit" onClick={onSalvar}>💾 Salvar</button>
          <button className="btn-danger" onClick={onFechar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}