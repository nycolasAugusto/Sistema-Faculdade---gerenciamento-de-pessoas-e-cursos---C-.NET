// components/dashboard/Dashboard.tsx

import { useState, useEffect } from 'react';
import { Header } from '../../ui/Header';
import { TabMenu } from '../../ui/TabMenu';
import { TurmasAba } from './TurmasAba';
import { AlunosAba } from './AlunosAba';
import { CursosAba } from './CursosAba';
import { FuncionariosAba } from './FuncionariosAba';
import '../../styles/dashboard.css';

interface DashboardProps {
  token: string;
  perfil: string;
  usuarioId: string;
  setToken: (token: string) => void;
}

export function Dashboard({ token, perfil, usuarioId, setToken }: DashboardProps) {
  const [abaAtual, setAbaAtual] = useState('turmas');
  const isAdmin    = perfil === 'Coordenador' || perfil === 'Gestor';
  const isProfessor = perfil === 'Professor';

  const [turmas, setTurmas]           = useState<any[]>([]);
  const [alunos, setAlunos]           = useState<any[]>([]);
  const [cursos, setCursos]           = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);

  useEffect(() => {
    carregarTudo();
  }, [abaAtual]);

  async function carregarTudo() {
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      const res = await fetch('http://localhost:5043/api/turmas', config);
      if (res.ok) setTurmas(await res.json());
    } catch (e) { console.error(e); }

    if (isAdmin) {
      try {
        const res = await fetch('http://localhost:5043/api/alunos', config);
        if (res.ok) setAlunos(await res.json());
      } catch (e) { console.error(e); }

      try {
        const res = await fetch('http://localhost:5043/api/cursos', config);
        if (res.ok) {
          const todos = await res.json();
          if (perfil === 'Coordenador') {
            const meuId = parseInt(usuarioId);
            setCursos(todos.filter((c: any) => {
              const coords = c.coordenadores ?? c.Coordenadores ?? [];
              return coords.some((coord: any) => (coord.id ?? coord.Id) === meuId);
            }));
          } else {
            setCursos(todos);
          }
        }
      } catch (e) { console.error(e); }

      try {
        const res = await fetch('http://localhost:5043/api/funcionarios', config);
        if (res.ok) setFuncionarios(await res.json());
      } catch (e) { console.error(e); }
    }
  }

  return (
    <div className="dashboard-container">
      <Header perfil={perfil} onSair={() => setToken('')} />
      <TabMenu abaAtual={abaAtual} isAdmin={isAdmin} onChange={setAbaAtual} />

      {abaAtual === 'turmas' && (
        <TurmasAba
          token={token}
          isAdmin={isAdmin}
          isProfessor={isProfessor}
          turmas={turmas}
          cursos={cursos}
          professores={funcionarios}
          onRecarregar={carregarTudo}
        />
      )}

      {abaAtual === 'alunos' && isAdmin && (
        <AlunosAba
          token={token}
          alunos={alunos}
          onRecarregar={carregarTudo}
        />
      )}

      {abaAtual === 'cursos' && isAdmin && (
        <CursosAba
          token={token}
          cursos={cursos}
          onRecarregar={carregarTudo}
        />
      )}

      {abaAtual === 'funcionarios' && isAdmin && (
        <FuncionariosAba
          token={token}
          funcionarios={funcionarios}
          onRecarregar={carregarTudo}
        />
      )}
    </div>
  );
}