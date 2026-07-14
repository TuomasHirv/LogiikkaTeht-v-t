const partInstructions = {
  title: "Part 1 Complete: From Natural Language to Logical Equivalence",
  introduction:
    "Congratulations on completing Part 1! Over the last few lessons, we covered the foundation that all of propositional logic rests on. These skills will become more and more important as we move towards reasoning in Part 2.",
  paragraphs: [
    'We covered turning **natural language into propositions**. Sentences like "if it rains, the ground gets wet" become formal expressions like P → Q. This translation step matters because logic can only operate on precise, unambiguous statements — English is full of implicit meaning that formal notation forces you to make explicit.',
    "We also covered how to **deconstruct propositions into their subformulas**. A formula like ¬(P ∧ Q) → R is not one indivisible thing; it is built from smaller pieces (P, Q, P ∧ Q, ¬(P ∧ Q)) connected by operators. Being able to identify these pieces is what lets you analyze, evaluate, or rewrite a formula rather than just staring at it as a whole.",
    "Next was **truth tables**, which give you a way to determine exactly when a formula is true or false, for every possible combination of its variables. Truth tables are the ground truth of logic — every other rule or shortcut is only valid because it agrees with what the truth table says.",
    "Finally, we covered rewriting propositions into **equivalent forms** using rules like double negation, implication elimination, biconditional elimination, the contrapositive, and De Morgan's laws. These rules let you transform a formula without changing its meaning, which is essential for simplifying expressions or putting them into a shape that's easier to work with.",
    "**Part 2** builds directly on all of this. The **resolution method** is a systematic proof technique that works by breaking formulas into subformulas, rewriting them into a standard equivalent form, and then combining pieces to detect contradictions — every step depends on the skills covered above.",
    "Part 2 also introduces the **semantic tree** method, which organizes the process of checking every truth-value combination of a formula into a branching tree structure. It's essentially a more efficient, visual alternative to building a full truth table, so the intuition built around truth tables carries over directly.",
    "In short: Part 1 provided the vocabulary and tools; Part 2 shows how to use them to actually prove things. Without comfort in translation, decomposition, truth tables, and equivalence, the methods in Part 2 would just look like arbitrary symbol shuffling.",
  ],
  examples: [
    'Translation skill in action:\n"Either the alarm is broken, or someone is home" → ¬A ∨ H',
    "Decomposition skill in action:\n(P ∧ Q) → ¬R has subformulas: P, Q, P ∧ Q, R, ¬R",
    "Truth table skill in action:\nP → Q is false only when P = true and Q = false",
    "Equivalence skill in action:\n¬(P → Q) ≡ P ∧ ¬Q",
    "Preview of Part 2 — resolution method:\nRewrite formulas into clauses, then combine contradictory clauses to prove a conclusion follows",
    "Preview of Part 2 — semantic tree:\nBranch a formula into true/false cases, closing branches that lead to contradictions",
    "Good Luck 😃",
  ],
  definitions: [
    "Proposition = A declarative statement that is either true or false, expressed formally using variables and connectives",
    "Subformula = A smaller formula contained within a larger formula, formed by one of its connectives",
    "Truth Table = A table listing every combination of truth values for a formula's variables, alongside the formula's resulting truth value",
    "Resolution Method = A proof technique that combines equivalent, rewritten clauses to detect contradictions and establish logical conclusions",
    "Semantic Tree = A branching diagram used to test every possible truth assignment of a formula, closing branches that produce contradictions",
  ],
}

export default partInstructions
