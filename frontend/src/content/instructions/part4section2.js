const partInstructions = {
  title: "Natural Deduction: Rules That Need No Assumptions",
  introduction:
    "The previous lesson described what a natural deduction proof looks like without giving you any rules to apply. This lesson gives you five: ∧I, ∧E, ∨I, →E, and ¬E. What these have in common is that they work purely forward — each one takes lines you've already established and produces a new line from them. Nothing temporary is involved, nothing gets assumed and later withdrawn. This makes them the most straightforward rules in the system, and enough on their own to build real proofs.",
  paragraphs: [
    "**∧-introduction (∧I)** builds a conjunction. If A appears on one line and B appears on another, you may write A ∧ B, citing both lines. The two conjuncts can come from anywhere earlier in the proof, in any order, and the same line can be used twice if you happen to need A ∧ A.",
    "**∧-elimination (∧E)** uses a conjunction. If A ∧ B appears on a line, you may write A, or you may write B — either one, citing that single line. Each use of ∧E extracts one conjunct, so getting both takes two separate applications on two separate lines.",
    "**∨-introduction (∨I)** builds a disjunction, and it surprises people the first time. If A appears on a line, you may write A ∨ B, where B is *any* proposition at all — it doesn't need to be proven, mentioned, or related to anything. This is sound because a disjunction only claims that at least one side holds, and you already have A, so the claim is true regardless of what B turns out to be.",
    "**→-elimination (→E)** uses an implication, and is the rule traditionally called modus ponens. If A → B appears on one line and A appears on another, you may write B. Note the direction carefully: having the implication and its antecedent gets you the consequent. Having the implication and its *consequent* gets you nothing — that mistake is common enough to be worth watching for.",
    "**¬-elimination (¬E)** uses a negation. If A appears on one line and ¬A appears on another, you may write A ∧ ¬A, citing both lines. This is just ∧I applied to a formula and its own negation, but it's worth naming separately because of what it means: a line of the form A ∧ ¬A is a **contradiction**, and contradictions can never be true under any valuation.",
    "Deriving a contradiction from your premises (or later assumptions) tells you those premises can't all hold at once. On its own that looks like a dead end — you've produced something guaranteed false. Its real purpose appears in the next lesson: deriving a contradiction *inside a temporary assumption* is exactly what proves the assumption was wrong.",
    "One constraint applies to every rule here and is the most common source of invalid proofs: **rules apply to a line's main connective, not to connectives buried inside it.** Given (A ∧ B) → C, you cannot use ∧E to pull out A, because the line's main connective is →, not ∧ — the conjunction is a subformula, and rules don't reach inside subformulas. To get at that A, you would first need to establish the whole antecedent and use →E.",
    "These five rules only ever move forward, which means everything they can derive follows from what's already on the page. That's also their limit: some goals simply cannot be reached this way. A goal shaped like A → B, for instance, usually can't be built from these rules alone, because nothing here constructs an implication — only →I does that, and it needs an assumption. That gap is what the next lesson addresses.",
    "Step 1: look at what your premises' main connectives are.\nStep 2: for each connective, ask what the elimination rule lets you extract.\nStep 3: look at the goal's shape and ask which introduction rule would build it.\nStep 4: work forward from the premises, applying rules to reach the pieces the goal needs.\nStep 5: assemble the goal with the appropriate introduction rule.",
  ],
  examples: [
    "∧-introduction (∧I):\nFrom A and B, derive A ∧ B\n\n1. A          (premise)\n2. B          (premise)\n3. A ∧ B      (∧I, lines 1,2)",
    "∧-elimination (∧E):\nFrom A ∧ B, derive A or derive B\n\n1. P ∧ Q      (premise)\n2. P          (∧E, line 1)\n3. Q          (∧E, line 1)",
    "∨-introduction (∨I):\nFrom A, derive A ∨ B for any B\n\n1. P          (premise)\n2. P ∨ Q      (∨I, line 1)\n3. P ∨ ¬R     (∨I, line 1)",
    "→-elimination (→E), modus ponens:\nFrom A → B and A, derive B\n\n1. P → Q      (premise)\n2. P          (premise)\n3. Q          (→E, lines 1,2)",
    "¬-elimination (¬E):\nFrom A and ¬A, derive A ∧ ¬A\n\n1. P          (premise)\n2. ¬P         (premise)\n3. P ∧ ¬P     (¬E, lines 1,2)",
    "Deriving a contradiction from premises:\nPremises: P ∧ Q, ¬P\nGoal: P ∧ ¬P\n\n1. P ∧ Q      (premise)\n2. ¬P         (premise)\n3. P          (∧E, line 1)\n4. P ∧ ¬P     (¬E, lines 3,2)",
    "Rules apply to the main connective only:\n1. (A ∧ B) → C     (premise)\nThe main connective is →, so ∧E cannot be used here. Line 1's ∧ is inside a subformula and is out of reach.",
    "",
    "A full proof using several rules:\nPremises: P ∧ Q, Q → R\nGoal: R ∧ P\n\n1. P ∧ Q      (premise)\n2. Q → R      (premise)\n3. Q          (∧E, line 1)\n4. R          (→E, lines 2,3)\n5. P          (∧E, line 1)\n6. R ∧ P      (∧I, lines 4,5)",
  ],
  definitions: [
    "∧-Introduction (∧I) = From A and B on separate lines, derive A ∧ B",
    "∧-Elimination (∧E) = From A ∧ B, derive either conjunct on its own",
    "∨-Introduction (∨I) = From A, derive A ∨ B for any proposition B",
    "→-Elimination (→E) = From A → B and A, derive B (modus ponens)",
    "¬-Elimination (¬E) = From A and ¬A, derive the contradiction A ∧ ¬A",
    "Contradiction = A line of the form A ∧ ¬A, which no valuation can make true",
    "Main Connective = The connective a rule applies to — the outermost one on that line, never one inside a subformula",
  ],
  moduleName: "Basic-Rules-Natural-Deduction",
}

export default partInstructions
