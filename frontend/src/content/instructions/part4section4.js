const partInstructions = {
  title: "Recap: Natural Deduction",
  introduction:
    "That's natural deduction covered — and with it, the last of the proof methods in this course. Congratulations on working through it. This one asked something the others didn't: rather than following a procedure, you had to look at a goal and decide what to do. That skill is the whole point, and it's worth taking a moment to see the shape of what you've learned before it blurs into a list of rules.",
  paragraphs: [
    "The system is organised by connective, not by difficulty. Each of ∧, ∨, →, and ¬ comes with an **introduction rule** for building it and an **elimination rule** for using it. That pairing isn't an accident of presentation — it *is* the meaning of the connective. What it takes to establish A ∧ B, and what having A ∧ B lets you do, together say everything there is to say about ∧.",
    "The forward rules — ∧I, ∧E, ∨I, →E, and contradiction — only ever add lines that follow from what's already written. They're the reliable part of the system: if a step is available, it's available, and nothing can be lost by taking it. Most proofs are mostly these.",
    "Two of them are worth remembering for their oddities. **∨I** lets you attach any proposition at all to something you've proven, however unrelated, because a disjunction only claims one side holds. And **→E** runs in one direction only: an implication plus its antecedent gives the consequent, but an implication plus its consequent gives nothing.",
    "The **assumption rules** — →I, ¬I, and ∨E — are what make the system complete. Without them, no proof could ever produce an implication or a negation, since no forward rule builds either. They work by opening a box, reasoning inside it under a temporary assumption, and then **discharging**: closing the box so that only the rule's conclusion survives.",
    "Discharge is the idea worth carrying forward. Everything inside a box is conditional on its assumption, so when the box closes those lines become unusable — not because they were wrong, but because their support is gone. What survives is a single unconditional line: A → B for →I, ¬A for ¬I, or the shared conclusion C for ∨E.",
    "This is why the two characteristic errors are both about scope. Citing a line inside a closed box treats conditional work as if it were established outright; ending a proof with a box still open proves the goal only *given* something you never withdrew. A finished proof ends at depth 0, with every assumption discharged.",
    "One structural constraint ran through everything: rules apply to a line's **main connective**, never to one buried inside a subformula. Given (A ∧ B) → C, the ∧ is out of reach — the line's main connective is →, and only →E applies. Most invalid steps come from reaching inside a formula that isn't structured the way the rule needs.",
    "Compared to the other methods, natural deduction answers a different question. Truth tables and semantic trees ask whether a proposition *can* be true. Resolution asks whether a set of clauses is contradictory. Natural deduction asks whether a conclusion *must* follow from premises, and answers it by building an argument you could hand to someone else — which is why proofs written this way look like ordinary mathematical reasoning rather than the output of an algorithm.",
    "That difference is also its cost. Resolution guarantees that grinding through every step will eventually settle the question. Natural deduction offers no such guarantee: several rules may apply, only some paths go anywhere, and choosing well comes from reading the goal's shape rather than from following a procedure.",
  ],
  examples: [
    "The rules, by connective:\n∧  — ∧I builds, ∧E uses\n∨  — ∨I builds, ∨E uses (two boxes)\n→  — →I builds (one box), →E uses\n¬  — ¬I builds (one box), contradiction pairs A with ¬A",
    "Which rules need a box:\nNo box — ∧I, ∧E, ∨I, →E, contradiction\nOne box — →I, ¬I\nTwo sibling boxes — ∨E",
    "Choosing a rule from the goal's shape:\nGoal is A ∧ B  → prove each half, then ∧I\nGoal is A ∨ B  → prove either half, then ∨I\nGoal is A → B  → assume A, derive B, then →I\nGoal is ¬A     → assume A, derive a contradiction, then ¬I",
    "A proof using both lessons:\nPremises: P → Q, Q → R\nGoal: P → R\n\n1. P → Q  (premise)\n2. Q → R  (premise)\n3.  | P  (assumption)\n4.  | Q  (→E lines: 1,3)\n5.  | R  (→E lines: 2,4)\n6. P → R  (→I lines: 3,5)",
    "The two scope errors:\nCiting a line from a closed box — its support was discharged, so it no longer stands.\nEnding a proof at depth 1 — the goal was proved given an assumption that was never withdrawn.",
  ],
  definitions: [
    "Introduction Rule = A rule that builds a formula with a given connective",
    "Elimination Rule = A rule that draws a conclusion from a formula with a given connective",
    "Forward Rule = A rule needing no assumption: ∧I, ∧E, ∨I, →E, contradiction",
    "Assumption Rule = A rule requiring a box: →I, ¬I, ∨E",
    "Discharge = Closing a box so that only the rule's conclusion survives",
    "Main Connective = The outermost connective on a line, and the only one a rule can apply to",
  ],
}

export default partInstructions
