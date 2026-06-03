// components/modais/ModalEditarTurma.tsx

export type ModalTurmaState = {
  id: number;
  nome: string;
  professorId: string;
  cursosIds: string;
  emAndamento: boolean;
};

interface Props {
  dados: ModalTurmaState;
  onChange: (dados: ModalTurmaState) => void;
  onSalvar: () => void;
  onFechar: () => void;
}

export function ModalEditarTurma({ dados, onChange, onSalvar, onFechar }: Props) {
  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p className="modal-title">
          Editar Turma <span>#{dados.id}</span>
        </p>

        <label className="field-label">Nome</label>
        <input
          className="input-field"
          value={dados.nome}
          onChange={e => onChange({ ...dados, nome: e.target.value })}
        />

        <label className="field-label">ID do Professor</label>
        <input
          className="input-field"
          type="number"
          value={dados.professorId}
          onChange={e => onChange({ ...dados, professorId: e.target.value })}
        />

        <label className="field-label">IDs dos Cursos (ex: 1, 2)</label>
        <input
          className="input-field"
          value={dados.cursosIds}
          onChange={e => onChange({ ...dados, cursosIds: e.target.value })}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={dados.emAndamento}
            onChange={e => onChange({ ...dados, emAndamento: e.target.checked })}
          />
          Em Andamento
        </label>

        <div className="modal-actions">
          <button className="btn-edit" onClick={onSalvar}>💾 Salvar</button>
          <button className="btn-danger" onClick={onFechar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}