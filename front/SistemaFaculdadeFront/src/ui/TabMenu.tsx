// components/ui/TabMenu.tsx

interface TabMenuProps {
  abaAtual: string;
  isAdmin: boolean;
  onChange: (aba: string) => void;
}

const ABAS = [
  { id: 'turmas',       label: 'Turmas',       soAdmin: false },
  { id: 'alunos',       label: 'Alunos',       soAdmin: true  },
  { id: 'cursos',       label: 'Cursos',       soAdmin: true  },
  { id: 'funcionarios', label: 'Funcionários', soAdmin: true  },
];

export function TabMenu({ abaAtual, isAdmin, onChange }: TabMenuProps) {
  const abasVisiveis = ABAS.filter(a => !a.soAdmin || isAdmin);

  return (
    <div className="tab-menu">
      {abasVisiveis.map(aba => (
        <button
          key={aba.id}
          className={`btn-tab${abaAtual === aba.id ? ' active' : ''}`}
          onClick={() => onChange(aba.id)}
        >
          {aba.label}
        </button>
      ))}
    </div>
  );
}