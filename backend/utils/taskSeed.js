const tasks = [
  {
    type: "forming-propositions",
    module_name: "words-to-propositions",
    question: "Kuu on juustoa ja Aurinko palaa.",
    correct_answer: { answers: ["K ∧ A", "A ∧ K"] },
    metadata: {
      definitions: ["K = Kuu on juustoa", "A = Aurinko palaa"],
    },
  },
  {
    type: "forming-propositions",
    module_name: "words-to-propositions",
    question: "Kuu ei ole juustoa.",
    correct_answer: { answers: ["¬K"] },
    metadata: {
      definitions: ["K = Kuu on juustoa"],
    },
  },
  {
    type: "forming-propositions",
    module_name: "words-to-propositions",
    question: "Olen myöhässä ja nukuinpommiin tai olen etuajassa.",
    correct_answer: {
      answers: ["(O ∧ L) ∨ E", "(L ∧ O) ∨ E", "E ∨ (O ∧ L)", "E ∨ (L ∧ O)"],
    },
    metadata: {
      definitions: [
        "O = nukuin pommiin",
        "L = Olen myöhässä",
        "E = Olen etuajassa",
      ],
    },
  },
  {
    type: "forming-propositions",
    module_name: "words-to-propositions",
    question:
      "Jos en nukkunut pommiin ja bussi on ajoissa niin olen ajoissa paikalla",
    correct_answer: {
      answers: ["(¬O ∧ B) →  A", "(¬B ∧ O) →  A"],
    },
    metadata: {
      definitions: [
        "O = nukuin pommiin",
        "B = bussi on ajoissa",
        "A = Olen ajoissa paikalla",
      ],
    },
  },
  {
    type: "forming-propositions-difficult",
    module_name: "words-to-propositions",
    question:
      "Jos sataa ja unohdin sateenvarjon, niin kastun, paitsi jos olen sisällä.",
    correct_answer: {
      answers: [
        "(S ∧ U ∧ ¬I) → K",
        "(U ∧ S ∧ ¬I) → K",
        "(¬I ∧ S ∧ U) → K",
        "(¬I ∧ U ∧ S) → K",
      ],
    },
    metadata: {
      definitions: [
        "S = sataa",
        "U = unohdin sateenvarjon",
        "I = olen sisällä",
        "K = kastun",
      ],
    },
  },
  {
    type: "forming-propositions-difficult",
    module_name: "words-to-propositions",
    question:
      "Läpäisen kokeen jos ja vain jos opiskelin ja en nukkunut tunnilla.",
    correct_answer: {
      answers: ["P ↔ (O ∧ ¬N)", "P ↔ (¬N ∧ O)", "(O ∧ ¬N) ↔ P", "(¬N ∧ O) ↔ P"],
    },
    metadata: {
      definitions: [
        "P = Läpäisen kokeen",
        "O = opiskelin",
        "N = nukuin tunnilla",
      ],
    },
  },
  {
    type: "destructure",
    module_name: "subformula",
    question: "P ∨ ¬Q",
    correct_answer: {
      text: "P ∨ ¬Q",
      children: [
        { text: "P", children: null },
        { text: "¬Q", children: [{ text: "Q", children: {} }] },
      ],
    },
    metadata: {},
  },
  {
    type: "destructure",
    module_name: "subformula",
    question: "¬(P → Q)",
    correct_answer: {
      text: "¬(P → Q)",
      children: [
        {
          text: "(P → Q)",
          children: [
            { text: "P", children: null },
            { text: "Q", children: null },
          ],
        },
      ],
    },
    metadata: {},
  },
  {
    type: "create-truth-table",
    module_name: "Truth-Table-Task",
    question: "¬P ∨ Q",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
        ["¬P", "0", "0", "1", "1"],
        ["¬P ∨ Q", "1", "0", "1", "1"],
      ],
    },
    metadata: { start: ["P", "Q"] },
  },
  {
    type: "create-truth-table",
    module_name: "Truth-Table-Task",
    question: "P → Q",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
        ["P → Q", "1", "0", "1", "1"],
      ],
    },
    metadata: { start: ["P", "Q"] },
  },
  {
    type: "create-truth-table",
    module_name: "Truth-Table-Task",
    question: "P ∧ ¬P",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["¬P", "0", "0", "1", "1"],
        ["P ∧ ¬P", "0", "0", "0", "0"],
      ],
    },
    metadata: { start: ["P"] },
  },
  {
    type: "create-truth-table",
    module_name: "Truth-Table-Task",
    question: "P ∨ ¬P",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["¬P", "0", "0", "1", "1"],
        ["P ∨ ¬P", "1", "1", "1", "1"],
      ],
    },
    metadata: { start: ["P"] },
  },
  {
    type: "create-truth-table-difficult",
    module_name: "Truth-Table-Task",
    question: "(P → Q) ↔ (¬Q → ¬P)",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
        ["¬P", "0", "0", "1", "1"],
        ["¬Q", "0", "1", "0", "1"],
        ["P → Q", "1", "0", "1", "1"],
        ["¬Q → ¬P", "1", "0", "1", "1"],
        ["(P → Q) ↔ (¬Q → ¬P)", "1", "1", "1", "1"],
      ],
    },
    metadata: { start: ["P", "Q"] },
  },
  {
    type: "create-truth-table",
    module_name: "Truth-Table-Task",
    question: "¬(P ∧ Q)",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
        ["P ∧ Q", "1", "0", "0", "0"],
        ["¬(P ∧ Q)", "0", "1", "1", "1"],
      ],
    },
    metadata: { start: ["P", "Q"] },
  },
  {
    type: "create-truth-table",
    module_name: "Truth-Table-Task",
    question: "¬P ∨ ¬Q",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
        ["¬P", "0", "0", "1", "1"],
        ["¬Q", "0", "1", "0", "1"],
        ["¬P ∨ ¬Q", "0", "1", "1", "1"],
      ],
    },
    metadata: { start: ["P", "Q"] },
  },
  {
    type: "create-truth-table",
    module_name: "Truth-Table-Task",
    question: "(P ∨ Q) ∧ ¬P",
    correct_answer: {
      answer: [
        ["P", "1", "1", "0", "0"],
        ["Q", "1", "0", "1", "0"],
        ["P ∨ Q", "1", "1", "1", "0"],
        ["¬P", "0", "0", "1", "1"],
        ["(P ∨ Q) ∧ ¬P", "0", "0", "1", "0"],
      ],
    },
    metadata: { start: ["P", "Q"] },
  },
  {
    type: "create-truth-table-difficult",
    module_name: "Truth-Table-Task",
    question: "(P ∧ Q) ∨ (P ∧ R)",
    correct_answer: {
      answer: [
        ["P", "1", "1", "1", "1", "0", "0", "0", "0"],
        ["Q", "1", "1", "0", "0", "1", "1", "0", "0"],
        ["R", "1", "0", "1", "0", "1", "0", "1", "0"],
        ["P ∧ Q", "1", "1", "0", "0", "0", "0", "0", "0"],
        ["P ∧ R", "1", "0", "1", "0", "0", "0", "0", "0"],
        ["(P ∧ Q) ∨ (P ∧ R)", "1", "1", "1", "0", "0", "0", "0", "0"],
      ],
    },
    metadata: { start: ["P", "Q", "R"] },
  },
  {
    type: "create-truth-table-difficult",
    module_name: "Truth-Table-Task",
    question: "((P → Q) ∧ (Q → R)) → (P → R)",
    correct_answer: {
      answer: [
        ["P", "1", "1", "1", "1", "0", "0", "0", "0"],
        ["Q", "1", "1", "0", "0", "1", "1", "0", "0"],
        ["R", "1", "0", "1", "0", "1", "0", "1", "0"],
        ["P → Q", "1", "1", "0", "0", "1", "1", "1", "1"],
        ["Q → R", "1", "0", "1", "1", "1", "0", "1", "1"],
        ["(P → Q) ∧ (Q → R)", "1", "0", "0", "0", "1", "0", "1", "1"],
        ["P → R", "1", "0", "1", "0", "1", "1", "1", "1"],
        [
          "((P → Q) ∧ (Q → R)) → (P → R)",
          "1",
          "1",
          "1",
          "1",
          "1",
          "1",
          "1",
          "1",
        ],
      ],
    },
    metadata: { start: ["P", "Q", "R"] },
  },
  {
    type: "create-truth-table-difficult",
    module_name: "Truth-Table-Task",
    question: "(P ↔ Q) ∨ (P ↔ R)",
    correct_answer: {
      answer: [
        ["P", "1", "1", "1", "1", "0", "0", "0", "0"],
        ["Q", "1", "1", "0", "0", "1", "1", "0", "0"],
        ["R", "1", "0", "1", "0", "1", "0", "1", "0"],
        ["P ↔ Q", "1", "1", "0", "0", "0", "0", "1", "1"],
        ["P ↔ R", "1", "0", "1", "0", "0", "1", "0", "1"],
        ["(P ↔ Q) ∨ (P ↔ R)", "1", "1", "1", "0", "0", "1", "1", "1"],
      ],
    },
    metadata: { start: ["P", "Q", "R"] },
  },

  {
    type: "destructure",
    module_name: "subformula",
    question: "P ∧ Q",
    correct_answer: {
      text: "P ∧ Q",
      children: [
        { text: "P", children: null },
        { text: "Q", children: null },
      ],
    },
    metadata: {},
  },
  {
    type: "destructure-difficult",
    module_name: "subformula",
    question: "(P ∧ Q) → ¬R",
    correct_answer: {
      text: "(P ∧ Q) → ¬R",
      children: [
        {
          text: "(P ∧ Q)",
          children: [
            { text: "P", children: null },
            { text: "Q", children: null },
          ],
        },
        {
          text: "¬R",
          children: [{ text: "R", children: {} }],
        },
      ],
    },
    metadata: {},
  },
  {
    type: "destructure-difficult",
    module_name: "subformula",
    question: "¬(P ∧ ¬Q)",
    correct_answer: {
      text: "¬(P ∧ ¬Q)",
      children: [
        {
          text: "(P ∧ ¬Q)",
          children: [
            { text: "P", children: null },
            {
              text: "¬Q",
              children: [{ text: "Q", children: {} }],
            },
          ],
        },
      ],
    },
    metadata: {},
  },
  {
    type: "destructure-difficult",
    module_name: "subformula",
    question: "(¬P ∨ Q) ↔ (P → Q)",
    correct_answer: {
      text: "(¬P ∨ Q) ↔ (P → Q)",
      children: [
        {
          text: "(¬P ∨ Q)",
          children: [
            {
              text: "¬P",
              children: [{ text: "P", children: {} }],
            },
            { text: "Q", children: null },
          ],
        },
        {
          text: "(P → Q)",
          children: [
            { text: "P", children: null },
            { text: "Q", children: null },
          ],
        },
      ],
    },
    metadata: {},
  },
  {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "¬¬P ∨ ¬¬Q",
    correct_answer: { remove: ["¬"] },
    metadata: { end_goal: "Remove all ¬ (negations)" },
  },
  {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "P → Q",
    correct_answer: { remove: ["→"] },
    metadata: { end_goal: "Remove all → (implications)" },
  },
  {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "¬(P ∧ Q)",
    correct_answer: { remove: ["∧"] },
    metadata: { end_goal: "Remove all ∧ (conjunctions)" },
  },
  {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "P ∧ (Q → R)",
    correct_answer: { remove: ["→"] },
    metadata: { end_goal: "Remove all → (implications)" },
  },
  {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "P ∨ ¬(Q ∧ R)",
    correct_answer: { remove: ["∧"] },
    metadata: { end_goal: "Remove all ∧ (conjunctions)" },
  },
  {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "¬(P → Q)",
    correct_answer: { remove: ["→", "∨"] },
    metadata: { end_goal: "Remove all → (implications) and ∨ (conjunctions)" },
  },
  {
    type: "proposition-change",
    module_name: "Equivalence-Rules-Task",
    question: "P ↔ Q",
    correct_answer: { remove: ["→", "↔"] },
    metadata: {
      end_goal: "Remove all → (implications) and ↔ (biconditionals)",
    },
  },
  {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "(P ∨ Q) ∧ R",
    correct_answer: {
      groups: [
        ["P", "Q", "R"],
        ["P", "¬Q", "R"],
        ["¬P", "Q", "R"],
      ],
      form: "DNF",
    },
    metadata: {
      start: ["P", "Q", "R"],
      end_goal: "Write the final answer in DNF.",
    },
  },
  {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "P ∧ (Q ↔ R)",
    correct_answer: {
      groups: [
        ["P", "Q", "R"],
        ["P", "¬Q", "¬R"],
      ],
      form: "DNF",
    },
    metadata: {
      start: ["P", "Q", "R"],
      end_goal: "Write the final answer in DNF.",
    },
  },
  {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "(P ∨ ¬Q) ∧ (Q ∨ R)",
    correct_answer: {
      groups: [
        ["P", "Q", "R"],
        ["P", "Q", "¬R"],
        ["P", "¬Q", "R"],
        ["¬P", "¬Q", "R"],
      ],
      form: "DNF",
    },
    metadata: {
      start: ["P", "Q", "R"],
      end_goal: "Write the final answer in DNF.",
    },
  },
  {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "P → (Q ∨ R)",
    correct_answer: {
      groups: [["¬P", "Q", "R"]],
      form: "CNF",
    },
    metadata: {
      start: ["P", "Q", "R"],
      end_goal: "Write the final answer in CNF.",
    },
  },
  {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "P ∨ (Q ∧ R)",
    correct_answer: {
      groups: [
        ["P", "¬Q,", "R)"],
        ["P", "Q", "¬R"],
        ["P", "Q", "R"],
      ],
      form: "CNF",
    },
    metadata: {
      start: ["P", "Q", "R"],
      end_goal: "Write the final answer in CNF.",
    },
  },
  {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "P ∨ (Q ∧ R)",
    correct_answer: {
      groups: [
        ["P", "¬Q", "R"],
        ["P", "Q", "¬R)"],
        ["P", "Q", "R"],
      ],
      form: "CNF",
    },
    metadata: {
      start: ["P", "Q", "R"],
      end_goal: "Write the final answer in CNF.",
    },
  },
  {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "(P ↔ Q) ∨ R",
    correct_answer: {
      groups: [
        ["¬P", "Q", "R"],
        ["P", "¬Q", "R"],
      ],
      form: "CNF",
    },
    metadata: {
      start: ["P", "Q", "R"],
      end_goal: "Write the final answer in CNF.",
    },
  },
  {
    type: "DNF-to-CNF",
    module_name: "TT-method-Conversion",
    question: "(P ∨ Q) → (R ∨ S)",
    correct_answer: {
      groups: [
        ["¬P", "¬Q", "R", "S"],
        ["¬P", "Q", "R", "S"],
        ["P", "¬Q", "R", "S)"],
      ],
      form: "CNF",
    },
    metadata: {
      start: ["P", "Q", "R", "S"],
      end_goal: "Write the final answer in CNF.",
    },
  },
  {
    type: "Transform-To-Normal-Form",
    module_name: "Equivalence-method-Transform",
    question: "(P → Q) ∧ R",
    correct_answer: { remove: ["→", "↔"], form: "DNF" },
    metadata: { end_goal: "Create DNF from this" },
  },
  {
    type: "Transform-To-Normal-Form",
    module_name: "Equivalence-method-Transform",
    question: "(P ↔ Q) ∧ R",
    correct_answer: { remove: ["→", "↔"], form: "DNF" },
    metadata: { end_goal: "Create DNF from this" },
  },
  {
    type: "Transform-To-Normal-Form",
    module_name: "Equivalence-method-Transform",
    question: "¬(P → (Q ∧ R))",
    correct_answer: { remove: ["→", "↔"], form: "DNF" },
    metadata: { end_goal: "Create DNF from this" },
  },
  {
    type: "Transform-To-Normal-Form",
    module_name: "Equivalence-method-Transform",
    question: "¬(¬P → R) ∨ Q",
    correct_answer: { remove: ["→", "↔"], form: "CNF" },
    metadata: { end_goal: "Create CNF from this" },
  },
  {
    type: "Transform-To-Normal-Form",
    module_name: "Equivalence-method-Transform",
    question: "¬(P ↔ Q)",
    correct_answer: { remove: ["→", "↔"], form: "CNF" },
    metadata: { end_goal: "Create CNF from this" },
  },
  {
    type: "Transform-To-Normal-Form",
    module_name: "Equivalence-method-Transform",
    question: "(P → Q) ∨ (R ∧ S)",
    correct_answer: { remove: ["→", "↔"], form: "CNF" },
    metadata: { end_goal: "Create CNF from this" },
  },
  {
    type: "Transform-To-Normal-Form",
    module_name: "Equivalence-method-Transform",
    question: "(P ↔ Q) ∨ R",
    correct_answer: { remove: ["→", "↔"], form: "CNF" },
    metadata: { end_goal: "Create CNF from this" },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(P) ∧ (¬P)",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 2,
      assumptions: [["P"], ["¬P"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(P) ∧ (¬P ∨ Q)",
    correct_answer: {
      clauses: [["P"], ["Q"]],
      assumption_count: 2,
      assumptions: [["P"], ["¬P", "Q"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(P) ∧ (¬P ∨ Q) ∧ (¬Q)",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 3,
      assumptions: [["P"], ["¬P", "Q"], ["¬Q"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(¬P ∨ Q) ∧ (¬Q ∨ R) ∧ (P)",
    correct_answer: {
      clauses: [["P"], ["Q"], ["R"]],
      assumption_count: 3,
      assumptions: [["¬P", "Q"], ["¬Q", "R"], ["P"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(¬P ∨ Q) ∧ (¬Q ∨ R) ∧ (P) ∧ (¬R)",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 4,
      assumptions: [["¬P", "Q"], ["¬Q", "R"], ["P"], ["¬R"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(P ∨ Q) ∧ (¬P ∨ Q) ∧ (¬Q)",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 3,
      assumptions: [["P", "Q"], ["¬P", "Q"], ["¬Q"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(P ∨ Q ∨ R) ∧ (¬P ∨ Q) ∧ (¬Q) ∧ (¬R ∨ P)",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 4,
      assumptions: [["P", "Q", "R"], ["¬P", "Q"], ["¬Q"], ["¬R", "P"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Introduction",
    question: "(P ∨ Q) ∧ (¬Q ∨ R) ∧ (¬P ∨ R)",
    correct_answer: {
      clauses: [["P", "Q"], ["R"]],
      assumption_count: 3,
      assumptions: [
        ["P", "Q"],
        ["¬Q", "R"],
        ["¬P", "R"],
      ],
    },
  },
  // 1 — Modus Ponens, holds, simplest possible refutation
  {
    type: "Resolution-task",
    module_name: "Resolution-Refutation",
    question: "Premises: (P) ∧ (¬P ∨ Q)\nProve: Q",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 3,
      assumptions: [["P"], ["¬P", "Q"], ["¬Q"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Refutation",
    question: "Premises: (¬P ∨ Q) ∧ (¬Q ∨ R) ∧ (P)\nProve: R",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 4,
      assumptions: [["¬P", "Q"], ["¬Q", "R"], ["P"], ["¬R"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Refutation",
    question: "Premises: (P ∨ Q) ∧ (¬P)\nProve: Q",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 3,
      assumptions: [["P", "Q"], ["¬P"], ["¬Q"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Refutation",
    question: "Premises: (P) ∧ (Q)\nProve: ¬P",
    correct_answer: {
      clauses: [["P"], ["Q"]],
      assumption_count: 3,
      assumptions: [["P"], ["Q"], ["P"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Refutation",
    question: "Premises: (P ∨ Q) ∧ (¬P ∨ R) ∧ (¬Q ∨ R)\nProve: R",
    correct_answer: {
      clauses: [["∅"]],
      assumption_count: 4,
      assumptions: [["P", "Q"], ["¬P", "R"], ["¬Q", "R"], ["¬R"]],
    },
  },
  {
    type: "Resolution-task",
    module_name: "Resolution-Refutation",
    question: "Premises: (P ∨ Q) ∧ (R)\nProve: P",
    correct_answer: {
      clauses: [["Q"], ["R"], ["¬P"]],
      assumption_count: 3,
      assumptions: [["P", "Q"], ["R"], ["¬P"]],
    },
  },
  {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(A → B)",
    correct_answer: {
      final: "(p0 → p1)",
      shorthands: {
        A: ["p0"],
        B: ["p1"],
      },
    },
    metadata: {
      shorthands: { A: "p0", B: "p1" },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
  {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(B ∨ C)",
    correct_answer: {
      final: "(¬p0 ∨ p1)",
      shorthands: {
        A: ["p0"],
        B: ["¬", "A"],
        C: ["p1"],
      },
    },
    metadata: {
      shorthands: { A: "p0", B: "¬A", C: "p1" },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
  {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(C ↔ D)",
    correct_answer: {
      final: "((p0 ∧ p1) ↔ p2)",
      shorthands: {
        A: ["p0"],
        B: ["p1"],
        C: ["(", "A", "∧", "B", ")"],
        D: ["p2"],
      },
    },
    metadata: {
      shorthands: { A: "p0", B: "p1", C: "(A ∧ B)", D: "p2" },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
  {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(C → D)",
    correct_answer: {
      final: "(¬¬p0 → p1)",
      shorthands: {
        A: ["p0"],
        B: ["¬", "A"],
        C: ["¬", "B"],
        D: ["p1"],
      },
    },
    metadata: {
      shorthands: { A: "p0", B: "¬A", C: "¬B", D: "p1" },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
  {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(C ∧ E)",
    correct_answer: {
      final: "((p0 ∨ p1) ∧ ¬p2)",
      shorthands: {
        A: ["p0"],
        B: ["p1"],
        C: ["(", "A", "∨", "B", ")"],
        D: ["p2"],
        E: ["¬", "D"],
      },
    },
    metadata: {
      shorthands: { A: "p0", B: "p1", C: "(A ∨ B)", D: "p2", E: "¬D" },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
  {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(F → C)",
    correct_answer: {
      final: "((¬(p0 ∧ p1) ∨ p2) → (p0 ∧ p1))",
      shorthands: {
        A: ["p0"],
        B: ["p1"],
        C: ["p2"],
        D: ["(", "A", "↔", "B", ")"],
        E: ["(", "D", "∨", "C", ")"],
        F: ["¬", "E"],
        G: ["p3"],
      },
    },
    metadata: {
      shorthands: {
        A: "p0",
        B: "p1",
        C: "(A ∧ B)",
        D: "¬C",
        E: "p2",
        F: "(D ∨ E)",
      },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
  {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(F → G)",
    correct_answer: {
      final: "(¬((p0 ↔ p1) ∨ p2) → p3)",
      shorthands: {
        A: ["p0"],
        B: ["p1"],
        C: ["p2"],
        D: ["(", "A", "↔", "B", ")"],
        E: ["(", "D", "∨", "C", ")"],
        F: ["¬", "E"],
        G: ["p3"],
      },
    },
    metadata: {
      shorthands: {
        A: "p0",
        B: "p1",
        C: "p2",
        D: "(A ↔ B)",
        E: "(D ∨ C)",
        F: "¬E",
        G: "p3",
      },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
  {
    type: "Expand-Shorthand-Chain",
    module_name: "Recursive-Definition",
    question: "(H → C)",
    correct_answer: {
      final: "((((p0 ∨ p1) ↔ ¬p2) ∧ p3) → (p0 ∨ p1))",
      shorthands: {
        A: ["p0"],
        B: ["p1"],
        C: ["(", "A", "∨", "B", ")"],
        D: ["p2"],
        E: ["¬", "D"],
        F: ["(", "C", "↔", "E", ")"],
        G: ["p3"],
        H: ["(", "F", "∧", "G", ")"],
      },
    },
    metadata: {
      shorthands: {
        A: "p0",
        B: "p1",
        C: "(A ∨ B)",
        D: "p2",
        E: "¬D",
        F: "(C ↔ E)",
        G: "p3",
        H: "(F ∧ G)",
      },
      end_goal:
        "Fully expand the given proposition by opening one shorthand at a time",
    },
  },
  {
    type: "tree",
    module_name: "Semantic-Tree-Intro",
    question: "P ∧ ¬P",
    correct_answer: {
      lines: [["P", "¬P"]],
    },
    metadata: {},
  },
  {
    type: "tree",
    module_name: "Semantic-Tree-Intro",
    question: "(P ∨ Q) ∧ ¬P ∧ ¬Q",
    correct_answer: {
      lines: [
        ["P", "¬P"],
        ["Q", "¬Q"],
      ],
    },
    metadata: {},
  },
  {
    type: "tree",
    module_name: "Semantic-Tree-Intro",
    question: "(P → Q) ∧ P ∧ ¬Q",
    correct_answer: {
      lines: [
        ["P", "¬P"],
        ["Q", "¬Q"],
      ],
    },
    metadata: {},
  },
  {
    type: "tree",
    module_name: "Semantic-Tree-Intro",
    question: "¬(P ∧ Q) ∧ P",
    correct_answer: {
      lines: [
        ["P", "¬P"],
        ["P", "¬Q"],
      ],
    },
    metadata: {},
  },
  {
    type: "tree",
    module_name: "Semantic-Tree-Intro",
    question: "¬(P ∨ Q) ∧ P",
    correct_answer: {
      lines: [["P", "¬P"]],
    },
    metadata: {},
  },
  {
    type: "tree",
    module_name: "Semantic-Tree-Intro",
    question: "¬¬P ∧ ¬P",
    correct_answer: {
      lines: [["P", "¬P"]],
    },
    metadata: {},
  },
  {
    type: "tree",
    module_name: "Semantic-Tree-Intro",
    question: "(P ↔ Q) ∧ ¬P",
    correct_answer: {
      lines: [
        ["P", "¬P"],
        ["¬P", "¬Q"],
      ],
    },
    metadata: {},
  },
  {
    type: "tree",
    module_name: "Semantic-Tree-Intro",
    question: "¬(P → Q) ∧ (Q ∨ ¬P)",
    correct_answer: {
      lines: [
        ["Q", "¬Q"],
        ["P", "¬P"],
      ],
    },
    metadata: {},
  },
]

module.exports = tasks
