const db = require("../database/db")
// I have designed the database structure my self. Many of the tasks are AI-generated.
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
]

const seedDatabase = async () => {
  try {
    console.log("🔄 Starting database seeding...")
    await db.query("TRUNCATE TABLE tasks CASCADE")
    const qInsert = `
      INSERT INTO tasks (type, module_name, question, correct_answer, metadata) 
      VALUES ($1, $2, $3, $4, $5)
    `

    for (const task of tasks) {
      await db.query(qInsert, [
        task.type,
        task.module_name,
        task.question,
        task.correct_answer,
        task.metadata,
      ])
    }

    console.log(
      `✅ Successfully seeded ${tasks.length} tasks into the database!`,
    )
  } catch (error) {
    console.error("❌ Error while seeding database:", error)
  } finally {
    if (db.end) {
      await db.end()
    } else {
      process.exit(0)
    }
  }
}

seedDatabase()
