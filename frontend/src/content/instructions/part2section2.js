const partInstructions = {
  title: "Semantic Trees: Testing Whether a Proposition Can Be True",
  introduction:
    "The recursive definition showed that every proposition is built up in stages from simpler pieces. A semantic tree takes that structure and puts it to work answering a different question: is there any way to make this proposition true? The method breaks a proposition down step by step, and whenever there's more than one way to satisfy something, it splits into separate branches — one per possibility. Branches that force a variable to be both true and false close as impossible; branches that survive to the end describe an assignment that actually works.",
  paragraphs: [
    "A **semantic tree** starts with the proposition you're testing and repeatedly decomposes whatever formulas are still compound. Each step asks: what has to hold for this formula to be true? The answer to that question determines whether the tree continues in a single line or splits.",
    "When a formula can only be satisfied one way, the tree **chains** — the results are added one after another down the same branch. A conjunction A ∧ B is the clearest case: both halves must hold together, so both get added to the same branch, with no choice involved.",
    "When a formula can be satisfied in more than one way, the tree **forks** into two branches, one per possibility. A disjunction A ∨ B is the clearest case here: either half suffices, so the tree splits and each branch pursues one of them independently. Whatever was already on the branch carries into both sides of the fork.",
    "Which behaviour applies depends on the formula's main connective. Conjunctions chain, and so do ¬(A ∨ B), ¬(A → B), and ¬¬A — each of these has only one way to be satisfied. Disjunctions fork, and so do A → B, A ↔ B, ¬(A ∧ B), and ¬(A ↔ B) — each of these leaves a genuine choice.",
    "Decomposition stops when a branch reaches **literals** — bare variables or their negations, with nothing left to break down. At that point the branch is a complete description of one candidate assignment: every literal on it names a variable and the value it would have to take.",
    "A branch **closes** when it contains both some variable and its negation. That branch has forced an impossible assignment, so it's marked with an **X** and abandoned immediately — there's no point expanding anything further on a branch that already can't work.",
    "A branch that runs out of formulas to decompose without ever closing stays **open**, and an open branch is exactly what you're looking for: the literals on it spell out a truth assignment that makes the original proposition true. If every branch closes, no such assignment exists, and the proposition is unsatisfiable.",
    "Step 1: write the proposition at the root.\nStep 2: pick a formula on the branch that hasn't been decomposed yet.\nStep 3: look at its main connective — chain if there's only one way to satisfy it, fork into two branches if there's a choice.\nStep 4: whenever a branch contains a variable and its negation, mark it X and stop expanding it.\nStep 5: continue until every branch has either closed or run out of formulas to decompose.",
  ],
  examples: [
    "Chaining (∧): both halves must hold\nP ∧ Q\n  |\n  P\n  |\n  Q",
    "Forking (∨): either half suffices\nP ∨ Q\n /   \\\nP     Q",
    "A branch closing on a contradiction:\nP ∧ ¬P\n  |\n  P\n  |\n  ¬P\n  |\n  X",
    "Rules by main connective:\nChain — A ∧ B, ¬(A ∨ B), ¬(A → B), ¬¬A\nFork — A ∨ B, A → B, A ↔ B, ¬(A ∧ B), ¬(A ↔ B)",
    "How each fork rule splits:\nA ∨ B → branches A and B\nA → B → branches ¬A and B\n¬(A ∧ B) → branches ¬A and ¬B\nA ↔ B → branches (A ∧ B) and (¬A ∧ ¬B)",
    "How each chain rule continues:\nA ∧ B → adds A then B\n¬(A ∨ B) → adds ¬A then ¬B\n¬(A → B) → adds A then ¬B\n¬¬A → adds A",
    "A tree where every branch closes:\n(P ∨ Q) ∧ ¬P ∧ ¬Q\n  |\n  ¬P\n  |\n  ¬Q\n  |\n(P ∨ Q)\n /     \\\nP       Q\n|       |\nX       X\nBoth branches close, so the proposition is unsatisfiable.",
    "A tree with one branch closing and one staying open:\n¬(P ∧ Q) ∧ P\n  |\n  P\n  |\n¬(P ∧ Q)\n /       \\\n¬P       ¬Q\n |        |\n X     (open: P, ¬Q)\nThe open branch says P true and Q false satisfies the proposition.",
  ],
  definitions: [
    "Semantic Tree = A method for testing satisfiability by decomposing a proposition, branching wherever more than one assignment would work",
    "Chain = A decomposition adding its results to the same branch, used when a formula can only be satisfied one way",
    "Fork = A decomposition splitting into two branches, used when a formula can be satisfied in more than one way",
    "Closed Branch (X) = A branch containing both a variable and its negation, abandoned as impossible",
    "Open Branch = A fully decomposed branch with no contradiction, whose literals give a satisfying assignment",
    "Literal = A variable or its negation, the point at which decomposition stops",
  ],
  moduleName: "Semantic-Tree-Intro",
}

export default partInstructions
