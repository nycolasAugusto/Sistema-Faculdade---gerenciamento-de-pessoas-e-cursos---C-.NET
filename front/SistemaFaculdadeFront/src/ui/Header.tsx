// components/ui/Header.tsx

interface HeaderProps {
  perfil: string;
  onSair: () => void;
}

export function Header({ perfil, onSair }: HeaderProps) {
  return (
    <div className="dashboard-header">
      <h2>
        Painel do <span>{perfil}</span>
      </h2>
      <button className="btn-danger" onClick={onSair}>
        Sair
      </button>
    </div>
  );
}