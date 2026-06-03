// components/modais/ModalEditarAluno.tsx

export type ModalAlunoState = {
  id: number;
  nome: string;
  email: string;
  cursoId: string;
  periodo: string;
  ativo: boolean;
};

interface Props {
  dados: ModalAlunoState;
  onChange: (dados: ModalAlunoState) => void;
  onSalvar: () => void;
  onFechar: () => void;
}

export function ModalEditarAluno({ dados, onChange, onSalvar, onFechar }: Props) {
  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p className="modal-title">
          Editar Aluno <span>#{dados.id}</span>
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
            <label className="field-label">ID do Curso</label>
            <input
              className="input-field"
              type="number"
              value={dados.cursoId}
              onChange={e => onChange({ ...dados, cursoId: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Período</label>
            <input
              className="input-field"
              type="number"
              value={dados.periodo}
              onChange={e => onChange({ ...dados, periodo: e.target.value })}
            />
          </div>
        </div>

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={dados.ativo}
            onChange={e => onChange({ ...dados, ativo: e.target.checked })}
          />
          Ativo
        </label>

        <div className="modal-actions">
          <button className="btn-edit" onClick={onSalvar}>💾 Salvar</button>
          <button className="btn-danger" onClick={onFechar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}