// components/modais/ModalEditarCurso.tsx

export type ModalCursoState = {
  id: number;
  nomeCursoEnum: string;
  tempoDoCursoEmMeses: string;
  dataInicio: string;
  dataFim: string;
  campus: string;
  coordenadorIds: string;
};

interface Props {
  dados: ModalCursoState;
  onChange: (dados: ModalCursoState) => void;
  onSalvar: () => void;
  onFechar: () => void;
}

export function ModalEditarCurso({ dados, onChange, onSalvar, onFechar }: Props) {
  return (
    <div className="modal-overlay" onClick={onFechar}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <p className="modal-title">
          Editar Curso <span>#{dados.id}</span>
        </p>

        <label className="field-label">Curso</label>
        <select
          className="input-field"
          value={dados.nomeCursoEnum}
          onChange={e => onChange({ ...dados, nomeCursoEnum: e.target.value })}
        >
          <option value="0">Sistemas de Informação</option>
          <option value="1">Engenharia de Software</option>
          <option value="2">Ciência da Computação</option>
        </select>

        <div className="form-grid">
          <div>
            <label className="field-label">Tempo (meses)</label>
            <input
              className="input-field"
              type="number"
              value={dados.tempoDoCursoEmMeses}
              onChange={e => onChange({ ...dados, tempoDoCursoEmMeses: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Campus</label>
            <input
              className="input-field"
              value={dados.campus}
              onChange={e => onChange({ ...dados, campus: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Data Início</label>
            <input
              className="input-field"
              type="date"
              value={dados.dataInicio}
              onChange={e => onChange({ ...dados, dataInicio: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Data Fim</label>
            <input
              className="input-field"
              type="date"
              value={dados.dataFim}
              onChange={e => onChange({ ...dados, dataFim: e.target.value })}
            />
          </div>
          <div className="full-width">
            <label className="field-label">IDs dos Coordenadores (ex: 1, 2)</label>
            <input
              className="input-field"
              value={dados.coordenadorIds}
              onChange={e => onChange({ ...dados, coordenadorIds: e.target.value })}
            />
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