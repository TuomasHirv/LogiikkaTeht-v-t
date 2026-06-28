const db = require("../database/db")

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
