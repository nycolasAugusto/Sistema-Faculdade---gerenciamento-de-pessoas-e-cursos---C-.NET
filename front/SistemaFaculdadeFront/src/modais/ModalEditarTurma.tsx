// components/modais/ModalEditarTurma.tsx

export type ModalTurmaState = {
  id: number;
  nome: string;
  professorId: string;
  cursosIds: number[];  // ← array de inteiros agora
  emAndamento: boolean;
};

interface Props {
  dados: ModalTurmaState;
  onChange: (dados: ModalTurmaState) => void;
  onSalvar: () => void;
  onFechar: () => void;
  cursos: any[];
  professores: any[];
}

export function ModalEditarTurma({ dados, onChange, onSalvar, onFechar, cursos, professores }: Props) {

  function toggleCurso(id: number) {
    const jaTemn = dados.cursosIds.includes(id);
    onChange({
      ...dados,
      cursosIds: jaTemn
        ? dados.cursosIds.filter(c => c !== id)
        : [...dados.cursosIds, id],
    });
  }

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

        {/* SELECT PROFESSOR */}
        <label className="field-label">Professor</label>
        <select
          className="input-field"
          value={dados.professorId}
          onChange={e => onChange({ ...dados, professorId: e.target.value })}
        >
          <option value="">-- Selecione --</option>
          {professores.map((f: any) => {
            const id   = f.id   ?? f.Id;
            const nome = f.nome ?? f.Nome ?? '';
            return <option key={id} value={id}>{nome}</option>;
          })}
        </select>

        {/* MULTI-SELECT CURSOS */}
        <label className="field-label">Cursos (clique para selecionar)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', marginBottom: '8px' }}>
          {cursos.map((c: any) => {
            const id   = c.id   ?? c.Id;
            const nome = c.nomeCurso ?? c.NomeCurso ?? `Curso ${id}`;
            const selecionado = dados.cursosIds.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleCurso(id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: selecionado ? '2px solid #f5a623' : '1px solid #2a3050',
                  background: selecionado ? 'rgba(245,166,35,0.15)' : 'transparent',
                  color: selecionado ? '#f5a623' : '#8b91a8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: selecionado ? 700 : 400,
                  transition: '0.15s',
                }}
              >
                {nome}
              </button>
            );
          })}
          {cursos.length === 0 && (
            <span style={{ color: '#8b91a8', fontSize: '0.85rem' }}>Nenhum curso disponível.</span>
          )}
        </div>

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