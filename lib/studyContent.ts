export type StudySection = {
  id: string;
  title: string;
  minutes: number;
  bullets: string[];
  pegadinhas: string[];
  miniChecklist: string[];
};

export type StudyChapter = {
  chapter: number;
  name: string;
  sections: StudySection[];
};

export const STUDY_CHAPTERS: StudyChapter[] = [
  {
    chapter: 1,
    name: "Fundamentos de Teste",
    sections: [
      {
        id: "c1-oquee",
        title: "O que é teste (e o que NÃO é)",
        minutes: 12,
        bullets: [
          "Teste de software é um conjunto de atividades para descobrir defeitos e avaliar a qualidade de artefatos (objeto de teste).",
          "Teste não é só execução: inclui planejamento, análise, modelagem, implementação, execução e conclusão.",
          "Teste envolve verificação (conformidade com requisitos) e validação (atende necessidades reais).",
        ],
        pegadinhas: [
          "“Teste prova que não existem defeitos” → errado (teste reduz risco, não garante ausência).",
          "Confundir teste com depuração (debug) → são atividades diferentes.",
        ],
        miniChecklist: [
          "Consigo definir teste em 1 frase?",
          "Consigo diferenciar verificação vs validação?",
          "Se eu vir “garantir ausência de defeitos” eu marco como suspeito.",
        ],
      },
      {
        id: "c1-objetivos",
        title: "Objetivos típicos do teste",
        minutes: 10,
        bullets: [
          "Avaliar produtos de trabalho (requisitos, histórias, design, código).",
          "Detectar falhas/defeitos e reduzir o risco de qualidade.",
          "Garantir cobertura necessária e fornecer informação para decisão.",
          "Criar confiança e validar se está adequado ao uso pretendido.",
        ],
        pegadinhas: [
          "Objetivo NÃO é “corrigir defeitos” (isso é depuração).",
        ],
        miniChecklist: [
          "Sei listar pelo menos 5 objetivos típicos.",
          "Sei identificar objetivo correto pelo contexto (risco, nível de teste, stakeholders).",
        ],
      },
      {
        id: "c1-teste-vs-debug",
        title: "Teste x Depuração",
        minutes: 8,
        bullets: [
          "Teste: evidencia falhas causadas por defeitos (dinâmico) ou encontra defeitos diretamente (estático).",
          "Depuração: encontrar causa, diagnosticar e corrigir; depois confirmar e, se necessário, regressão.",
        ],
        pegadinhas: [
          "“Depuração é parte do teste” → errado.",
        ],
        miniChecklist: [
          "Consigo explicar em 10s: teste avalia; debug corrige.",
        ],
      },
      {
        id: "c1-termos",
        title: "Erro, Defeito, Falha, Causa-raiz",
        minutes: 10,
        bullets: [
          "Erro (humano) → Defeito (bug no artefato) → Falha (comportamento observado).",
          "Causa-raiz: motivo fundamental que levou ao erro; usada para prevenir recorrência.",
        ],
        pegadinhas: [
          "Falha ≠ defeito (falha é observada em execução).",
          "Defeito pode estar em requisitos, casos de teste, dados, código etc.",
        ],
        miniChecklist: [
          "Consigo dar exemplo real para cada termo.",
        ],
      },
      {
        id: "c1-principios",
        title: "7 princípios de teste (memorizar)",
        minutes: 15,
        bullets: [
          "Presença, não ausência de defeitos.",
          "Exaustivo é impossível.",
          "Testar cedo economiza.",
          "Defeitos se agrupam (Pareto).",
          "Testes se degradam.",
          "Depende do contexto.",
          "Falácia da ausência de defeitos.",
        ],
        pegadinhas: [
          "Questões com afirmações absolutas (“sempre”, “nunca”) costumam esconder erro.",
        ],
        miniChecklist: [
          "Consigo recitar os 7 princípios sem olhar.",
          "Consigo explicar 2 exemplos práticos (Pareto, degradação).",
        ],
      },
      {
        id: "c1-atividades",
        title: "Atividades do processo de teste (visão macro)",
        minutes: 12,
        bullets: [
          "Planejamento → Monitoramento/Controle → Análise → Modelagem → Implementação → Execução → Conclusão.",
          "Essas atividades podem ser iterativas/paralelas conforme o contexto.",
        ],
        pegadinhas: [
          "Modelagem (como testar) ≠ Execução (rodar testes).",
        ],
        miniChecklist: [
          "Consigo ordenar as atividades sem pensar muito.",
        ],
      },
    ],
  },

  {
    chapter: 2,
    name: "Testes ao longo do Ciclo de Vida (SDLC)",
    sections: [
      {
        id: "c2-sdlc-impacto",
        title: "Como o SDLC impacta os testes",
        minutes: 12,
        bullets: [
          "O modelo de desenvolvimento influencia: escopo e cronograma de testes, documentação, técnicas, automação, papéis.",
          "Em iterativo/incremental: feedback rápido, regressão frequente, testes estáticos e dinâmicos combinados.",
        ],
        pegadinhas: [
          "Não existe abordagem única de teste para todos os projetos.",
        ],
        miniChecklist: [
          "Sei citar 3 impactos do SDLC nos testes.",
        ],
      },
      {
        id: "c2-shiftleft-devops",
        title: "Shift-left e DevOps",
        minutes: 10,
        bullets: [
          "Shift-left: testar o mais cedo possível (antes de integrar / antes de implementar, quando possível).",
          "DevOps: integração de desenvolvimento (incluindo testes) e operações para objetivos comuns; CI/CD e feedback rápido.",
        ],
        pegadinhas: [
          "Shift-left não significa “apenas automação”; envolve revisões e colaboração.",
        ],
        miniChecklist: [
          "Consigo explicar shift-left em 1 frase + 1 exemplo.",
        ],
      },
      {
        id: "c2-niveis-tipos",
        title: "Níveis e tipos de teste",
        minutes: 18,
        bullets: [
          "Níveis: unidade/componente, integração de componentes, sistema, integração de sistema, aceite.",
          "Tipos: funcional (o que faz) e não funcional (quão bem faz: performance, segurança, usabilidade, etc.).",
          "Confirmação valida correção do defeito; regressão verifica que mudanças não quebraram o resto.",
        ],
        pegadinhas: [
          "Sistema ≠ Aceite; Aceite tem foco de usuário/negócio e critérios específicos.",
        ],
        miniChecklist: [
          "Consigo classificar um exemplo em nível e tipo corretamente.",
        ],
      },
    ],
  },

  {
    chapter: 3,
    name: "Teste Estático",
    sections: [
      {
        id: "c3-estatico",
        title: "Conceitos e valor do teste estático",
        minutes: 12,
        bullets: [
          "Teste estático não executa o software: revisões e análise estática.",
          "Ajuda a detectar defeitos cedo, melhorar qualidade e apoiar manutenibilidade e segurança.",
        ],
        pegadinhas: [
          "Teste estático encontra defeitos diretamente; não “gera falhas”.",
        ],
        miniChecklist: [
          "Sei dar 3 exemplos de produtos de trabalho revisáveis (requisitos, plano de teste, código...).",
        ],
      },
      {
        id: "c3-revisoes",
        title: "Processo de revisão e tipos",
        minutes: 16,
        bullets: [
          "Atividades: planejamento, início, revisão individual, comunicação/análise, correção/relatório.",
          "Papéis: autor, revisor, moderador, relator, líder de revisão, gerente.",
          "Tipos: informal, walkthrough, revisão técnica, inspeção (mais formal).",
        ],
        pegadinhas: [
          "Inspeção: processo mais formal; autor não lidera nem relata.",
        ],
        miniChecklist: [
          "Consigo distinguir walkthrough vs revisão técnica vs inspeção.",
        ],
      },
    ],
  },

  {
    chapter: 4,
    name: "Análise e Modelagem de Teste (técnicas)",
    sections: [
      {
        id: "c4-visao-geral",
        title: "Visão geral: por que técnicas existem",
        minutes: 10,
        bullets: [
          "Técnicas ajudam a responder “o que testar?” e “como testar?”, estruturando casos, condições, cobertura e dados.",
          "Na prova, você precisa reconhecer a técnica correta e aplicar em cenários.",
        ],
        pegadinhas: [
          "“Teste exploratório é sem disciplina” → errado (é intencional e guiado por heurísticas).",
        ],
        miniChecklist: [
          "Sei identificar qual técnica combina com qual tipo de problema.",
        ],
      },
      {
        id: "c4-caixa-preta",
        title: "Caixa-preta (baseada em especificação)",
        minutes: 22,
        bullets: [
          "Particionamento de equivalência (EP): classes válidas/ inválidas, reduzir combinações.",
          "Valor limite (BVA): testar bordas (min, max, logo abaixo/acima).",
          "Tabela de decisão: regras/condições → ações; bom para lógica combinatória.",
          "Transição de estado: eventos/estados; bom para workflows e ciclos.",
        ],
        pegadinhas: [
          "BVA não é “testar só valores extremos”, mas valores ao redor do limite.",
        ],
        miniChecklist: [
          "Consigo derivar casos EP/BVA para um campo (ex.: idade 18–65).",
          "Consigo ler uma tabela de decisão simples e contar casos mínimos.",
        ],
      },
      {
        id: "c4-caixa-branca",
        title: "Caixa-branca (estrutura interna)",
        minutes: 16,
        bullets: [
          "Cobertura de instrução: porcentagem de instruções executadas.",
          "Cobertura de ramificação: porcentagem de decisões (true/false) exercitadas.",
          "Útil para entender lacunas e complementar caixa-preta.",
        ],
        pegadinhas: [
          "100% instrução não implica 100% ramificação.",
        ],
        miniChecklist: [
          "Sei explicar a diferença entre cobertura de instrução e de ramificação.",
        ],
      },
      {
        id: "c4-experiencia",
        title: "Baseadas na experiência",
        minutes: 12,
        bullets: [
          "Suposição de erro: usar conhecimento histórico para focar onde falha.",
          "Exploratório: aprender, projetar e executar ao mesmo tempo (com objetivo).",
          "Checklist: lista de verificação como guia, especialmente para regressão.",
        ],
        pegadinhas: [
          "Checklist não substitui pensamento crítico; é um suporte.",
        ],
        miniChecklist: [
          "Consigo montar uma checklist curta para um fluxo crítico.",
        ],
      },
    ],
  },

  {
    chapter: 5,
    name: "Gerenciamento das Atividades de Teste",
    sections: [
      {
        id: "c5-planejamento",
        title: "Planejamento, critérios e estimativas",
        minutes: 18,
        bullets: [
          "Plano de teste define objetivos, abordagem, recursos, cronograma e critérios de entrada/saída.",
          "Critérios de entrada/saída ajudam a decidir quando iniciar/encerrar testes.",
          "Priorização considera risco, valor e restrições.",
        ],
        pegadinhas: [
          "Critério de saída não é “quando acabar o tempo”; precisa ser mensurável.",
        ],
        miniChecklist: [
          "Sei diferenciar critério de entrada vs saída com exemplo.",
        ],
      },
      {
        id: "c5-risco",
        title: "Risco e testes baseados em risco",
        minutes: 16,
        bullets: [
          "Risco = probabilidade × impacto.",
          "Riscos do produto (qualidade) vs riscos do projeto (prazo, recursos).",
          "Análise e controle de risco orientam o foco e a profundidade dos testes.",
        ],
        pegadinhas: [
          "Alto risco → mais testes (ou testes mais cedo/mais profundos).",
        ],
        miniChecklist: [
          "Consigo classificar risco como produto ou projeto.",
        ],
      },
      {
        id: "c5-monitoramento",
        title: "Métricas, status e conclusão",
        minutes: 12,
        bullets: [
          "Monitorar e controlar: comparar progresso real vs plano e ajustar.",
          "Relatórios devem ter público-alvo e objetivo claro.",
          "Conclusão: lições aprendidas, arquivar testware e encerrar ambiente.",
        ],
        pegadinhas: [
          "Métrica sem contexto pode enganar (ex.: só contar bugs).",
        ],
        miniChecklist: [
          "Sei citar 3 métricas e dizer quando fazem sentido.",
        ],
      },
      {
        id: "c5-defeitos-cm",
        title: "Gerenciamento de defeitos e configuração (CM)",
        minutes: 10,
        bullets: [
          "Relato de defeito deve ser claro: passos, evidências, esperado vs atual, severidade/prioridade.",
          "CM dá rastreabilidade e controle de versões para artefatos e ambientes.",
        ],
        pegadinhas: [
          "Severidade ≠ prioridade (impacto técnico/negócio vs urgência/ordem de correção).",
        ],
        miniChecklist: [
          "Consigo escrever um bug report com reprodutibilidade e evidência.",
        ],
      },
    ],
  },

  {
    chapter: 6,
    name: "Ferramentas de Teste",
    sections: [
      {
        id: "c6-ferramentas",
        title: "Suporte, benefícios e riscos",
        minutes: 10,
        bullets: [
          "Ferramentas apoiam atividades: gestão de teste, execução, automação, performance, CI/CD, defeitos, etc.",
          "Automação traz benefício (rapidez, repetibilidade) e risco (manutenção, falsos positivos, custo inicial).",
        ],
        pegadinhas: [
          "Automação não elimina necessidade de testes manuais (especialmente exploratório e usabilidade).",
        ],
        miniChecklist: [
          "Sei citar 3 riscos da automação e como mitigar.",
        ],
      },
    ],
  },
];
