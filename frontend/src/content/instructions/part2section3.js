const partInstructions = {
  title: "Recap: Recursive Structure and Semantic Trees",
  introduction:
    "That's both halves of this part done — nice work. The two lessons fit together more tightly than they might have looked at the time: the first established that every proposition is built in finite stages from bare symbols, and the second used exactly that structure to decide whether a proposition can be made true at all. This screen pulls the two together before moving on.",
  paragraphs: [
    "The **recursive definition** answered a question that's easy to skip past: how can a proposition be defined in terms of propositions without the definition being circular? The answer is that it isn't self-referential at all. Each stage Lₙ₊₁ is built only from formulas already sitting in Lₙ, so nothing is ever defined using itself — only using smaller things that already exist.",
    "The **shorthand-expansion exercise** made this concrete. Naming intermediate propositions A, B, C, ... and then expanding G all the way down to base symbols showed that even a formula defined through many layers of shorthand is, underneath, just one finite string over p₀, p₁, p₂ and connectives. Nothing mysterious was hiding in the layering.",
    "**Semantic trees** then put that same structure to work. Because every proposition decomposes into strictly smaller pieces, a tree that keeps decomposing is guaranteed to terminate — it can't loop forever, since each step moves down a stage and there are only finitely many stages to descend. That guarantee comes directly from the recursive definition.",
    "The tree's two behaviours track how many ways a formula can be satisfied. **Chaining** applies when there's exactly one way — a conjunction needs both halves, so both go on the same branch. **Forking** applies when there's a real choice — a disjunction needs only one half, so the tree splits and explores each option separately.",
    "Reading the result is the payoff. A branch **closes** with X when it contains a variable and its negation, meaning that particular combination of choices is impossible. A branch that stays **open** after full decomposition hands you a satisfying assignment directly: its literals name the variables and the values they take.",
    "This also connects back to the truth-table work from earlier. Each open branch corresponds to a row where the proposition comes out true, and each closed branch to a combination of choices that can't happen. The tree just finds those rows without building the whole table — which matters more the more variables a proposition has.",
    "Next comes natural deduction, which shifts the question. Semantic trees ask whether a proposition *can* be true. Natural deduction asks whether a conclusion *must* follow from a set of premises, and answers it by constructing a proof rather than by searching for an assignment.",
  ],
  examples: [
    "The recursive definition in one line:\nEvery proposition is either a bare symbol, or built from smaller propositions using ¬, ∧, ∨, →, or ↔.",
    "Why trees always terminate:\nEach decomposition step replaces a formula with strictly smaller subformulas. Since every proposition sits at some finite stage Lₙ, there are only finitely many steps available before literals are reached.",
    "Chain vs fork, at a glance:\nChain — one way to satisfy, results stay on the same branch\nFork — two ways to satisfy, branch splits in two",
    "Reading a finished tree:\nEvery branch closed → unsatisfiable, no assignment makes it true\nAt least one branch open → satisfiable, that branch's literals give an assignment",
  ],
  definitions: [
    "Recursive Definition = A base case plus a rule for building larger objects from already-defined smaller ones",
    "Lₙ (Stage n) = The propositions buildable in at most n connective-steps from bare symbols",
    "Semantic Tree = A decomposition method for deciding whether a proposition is satisfiable",
    "Closed Branch (X) = A branch containing a contradiction, representing an impossible combination of choices",
    "Open Branch = A fully decomposed contradiction-free branch, giving a satisfying assignment",
  ],
}

export default partInstructions
