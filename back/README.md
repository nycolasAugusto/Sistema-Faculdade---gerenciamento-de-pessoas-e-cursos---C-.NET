Desenvolvimento Web Avançado
Prof. Marlon
Avaliação A2-1. Desenvolvimento de Web API com C#
Valor: 2,0
Entrega: Os códigos devem estar disponíveis em um repositório no GitHub de pelo
menos um dos integrantes da equipe, e o link correspondente deve ser submetido no
Blackboard até às 18h do dia 27/04/2026, sob pena de desconto de 0,5 ptos por dia
de atraso.

1. Objetivos

Desenvolver uma Web API completa em C#, aplicando:

1) Sintaxe e conceitos da linguagem

2) Estruturas básicas

3) Web API

4) Entity Framework

5) Repository Pattern

2. Organização

• Trabalho em equipes (mínimo/ideal 3 alunos)

• Tema: livre (definido pela equipe)

• Entrega: código postado no BB na data + defesa presencial

3. Tema do Projeto

A equipe deve propor e implementar uma API para um sistema, por exemplo:

• Sistema de produtos (loja)

• Sistema acadêmico (alunos, cursos)

• Sistema de pedidos

• Agenda/contatos

• Biblioteca

Obrigatório: ter pelo menos 2 entidades relacionadas

Exemplo:

Produto → Categoria

Aluno → Curso

Pedido → ItemPedido

4. Requisitos Obrigatórios

Estrutura da aplicação

• Projeto em ASP.NET Web API

• Uso de Controllers

• Separação em camadas:

o Controllers

o Models

o Repository

Endpoints (CRUD mínimo)
Para pelo menos uma entidade principal:

• GET (listar todos)

• GET por ID

• POST (criar)

• PUT (atualizar)

• DELETE (remover)

Uso de C# (conceitos básicos)
A API deve demonstrar:

• uso correto de classes e objetos

• propriedades

• construtores (quando necessário)

• collections (List, arrays)

• pelo menos um enum

Regras de negócio

A API deve conter processamento real, como:

• cálculo (ex: total, média, desconto)

• validação (ex: idade mínima, campos obrigatórios)

• classificação (status, categoria)

Não será aceito CRUD “vazio” sem lógica.

Entity Framework

• Uso do Entity Framework Core

• Configuração do DbContext

• Mapeamento de entidades

• Persistência em banco (SQLite ou SQL Server)

Repository Pattern

• Implementar ao menos 1 repositório

• Separar acesso a dados da lógica da aplicação

• Exemplo:

ProdutoController → ProdutoRepository → Banco

Testes da API

• Testar endpoints com o Postman

• Demonstrar funcionamento na defesa

Entrega

A equipe deve entregar:

• Código fonte (GitHub ou .zip)

• Script do banco (se aplicável)

• README contendo:

o descrição do sistema

o lista de endpoints

Defesa (OBRIGATÓRIA E INDIVIDUAL)

Regra central:

A nota do trabalho está condicionada à defesa individual.

Respostas imprecisas, incorretas ou ausentes resultarão em desconto de 0,5 ponto na

nota do estudante para cada ocorrência.

Cada aluno deve ser capaz de:

• Explicar o projeto

• Executar endpoints

• Explicar o código

• Responder perguntas

5. Critérios de Avaliação

Funcionamento da API (0,5)

• Endpoints funcionando corretamente

• Integração com banco funcionando

• Uso adequado de controllers

Uso de Entity Framework (0,5)

• Configuração correta

• Persistência funcional

• Relacionamentos funcionando

Uso de Repository (0,5)

• Implementação correta

• Separação de responsabilidades

Regras de Negócio (0,5)

• Presença de lógica além de CRUD
