const partInstructions = {
  title: "Natural Deduction: Proving Things One Rule at a Time",
  introduction:
    "The methods covered so far — truth tables, resolution, semantic trees — all share a trait: they're mechanical. Once you know the procedure, there's always an obvious next step, and you grind through it until you hit a stopping condition. Natural deduction is different. It's a system of rules for building proofs the way a mathematician actually writes them: start from what you're given, apply rules that each handle one connective, and work toward what you're trying to show. There's no fixed order, and no algorithm telling you which rule to reach for — that choice is yours, and learning to make it well is the real skill this method teaches.",
  paragraphs: [
    "A **natural deduction proof** is a numbered sequence of lines. Each line holds one proposition, along with a **justification** saying where it came from — either that it was given as a premise, or which rule was applied to which earlier lines to produce it. This should look familiar: it's the same shape as the resolution proofs from earlier, just with many rules available instead of one.",
    "Every proof has **premises** (the propositions you're given, taken as true without needing to be derived) and a **goal** (the proposition you're trying to reach). A proof is finished when the goal appears as a line, correctly justified by everything above it.",
    "The rules come in pairs, one pair per connective. An **introduction rule** tells you how to *build* a formula with that connective — how to arrive at P ∧ Q, for instance. An **elimination rule** tells you how to *use* a formula that already has that connective — what you're entitled to conclude from P ∧ Q once you have it. Rule names follow this pattern: ∧I is 'and-introduction', ∧E is 'and-elimination', →E is 'implication-elimination', and so on.",
    "This pairing is what makes the system feel natural rather than arbitrary. Each connective's meaning is captured entirely by two questions: what does it take to establish this connective, and what does having it let you do? Nothing else about ∧ needs to be memorized — the two rules are the definition.",
    "Unlike resolution, natural deduction doesn't require converting anything into a normal form first. Premises are used exactly as written, with whatever connectives they happen to contain. This is part of why it's called *natural*: the proof works directly with the propositions you actually care about, rather than with a mechanically transformed version of them.",
    "The tradeoff is that there's no procedure guaranteeing you'll find a proof. With resolution, if the premises are contradictory, grinding through every resolution step will eventually find the empty clause. With natural deduction, several rules might apply at any given moment, and only some paths lead anywhere useful. Choosing well comes from recognizing what the goal's shape suggests — a skill built through practice rather than a rule that can be stated up front.",
    "Some rules also let you temporarily **assume** something you haven't proven, reason from it, and then set that assumption aside once you've learned what it leads to. This is the most powerful part of the system and the part that takes the most care, so it gets its own lessons later. For now, it's enough to know it exists.",
    "This lesson introduces no rules to apply yet. The next lessons cover the rules that work directly on what's already proven, then the ones involving assumptions, and finally how to decide which to reach for when facing a proof from scratch.",
  ],
  examples: [
    "Proof line format:\n3. P ∧ Q     (∧I, lines 1,2)",
    "Rule naming:\n∧I = and-introduction (builds a ∧)\n∧E = and-elimination (uses a ∧)\n→E = implication-elimination (uses a →)\n→I = implication-introduction (builds a →)",
    "A short proof:\nPremises: P, P → Q\nGoal: Q ∧ P\n\n1. P             (premise)\n2. P → Q         (premise)\n3. Q             (→E, lines 1,2)\n4. Q ∧ P         (∧I, lines 3,1)",
    "The same premises, a different goal:\nPremises: P, P → Q\nGoal: Q\n\n1. P             (premise)\n2. P → Q         (premise)\n3. Q             (→E, lines 1,2)\nThe proof ends as soon as the goal appears — line 4 above was only needed because that proof's goal was larger.",
  ],
  definitions: [
    "Natural Deduction = A proof system where each connective has rules for building it and for using it, applied in any order to reach a goal",
    "Premise = A proposition given at the start of a proof, accepted without derivation",
    "Goal = The proposition a proof is trying to reach",
    "Justification = The note on each proof line stating the rule used and which earlier lines it was applied to",
    "Introduction Rule = A rule that produces a formula containing a given connective (∧I, ∨I, →I, ¬I, ↔I)",
    "Elimination Rule = A rule that draws a conclusion from a formula containing a given connective (∧E, ∨E, →E, ¬E, ↔E)",
  ],
  moduleName: "Multiple-Choice-Natural-Deduction",
}

export default partInstructions
