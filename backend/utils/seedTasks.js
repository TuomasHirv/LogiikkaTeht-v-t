const db = require("../database/db")

const tasks = [
  {
    type: "destructure∧∨¬→↔",
    module_name: "subformula",
    question: "P ∨ ¬Q",
    correct_answer: "metadata",
    metadata: {
      text: "P ∨ ¬Q",
      children: [
        { text: "P", children: null },
        { text: "¬Q", children: [{ text: "Q", children: {} }] },
      ],
    },
  },
  {
    type: "destructure∧∨¬→↔",
    module_name: "subformula",
    question: "¬(P → Q)",
    correct_answer: "metadata",
    metadata: {
      text: "¬(P → Q)",
      children: [{ text: "(P → Q)", children: { text: "P", children: null } }],
    },
  },
]

const seedDatabase = async () => {
  try {
    console.log("🔄 Starting database seeding...")

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
