const partInstructions = {
  title: "Recap: The Resolution Method",
  introduction:
    "Both resolution lessons are done — well done getting through them. Resolution is the most mechanical proof method in this course, and that's its whole appeal: once the premises are in clause form, there's no cleverness required, only patience. The first lesson gave you the single rule the method is built from, and the second showed what that rule is actually for. This screen ties the two together before moving on.",
  paragraphs: [
    "The method rests on one rule. Given two clauses C₁ ∪ {pᵢ} and C₂ ∪ {¬pᵢ}, the **resolvent** is C₁ ∪ C₂ — drop the complementary pair, keep everything else. Because clauses are sets, order never matters and duplicate literals collapse on their own.",
    "One detail from that lesson is worth restating, because it's the rule's most important constraint: resolution removes **exactly one** complementary pair per step. Two clauses sharing two complementary pairs cannot have both cancelled at once. {P, Q} and {¬P, ¬Q} are perfectly satisfiable together, yet cancelling both pairs would produce the empty clause and claim otherwise. The one-pair-at-a-time restriction isn't a pacing choice — it's what makes the rule sound.",
    "The **empty clause** falls out of the definition rather than being bolted on. A clause is a finite set of literals, so the empty set qualifies as one, and since no literal in it can ever be satisfied, no valuation makes it true. Deriving ∅ therefore means the clauses it came from cannot all hold at once.",
    "The second lesson turned that into a proof technique. To show Γ ⊨ φ, negate the conclusion, add ¬φ to the premise clauses, and run resolution on the combined set. Reaching ∅ proves the combined set is unsatisfiable — which is exactly the statement that φ must hold whenever Γ does.",
    "Only the conclusion gets negated. The premises go in untouched. Negating the wrong thing searches for a contradiction in a different set entirely, and any empty clause found that way says nothing about the entailment you were trying to establish.",
    "The other ending matters just as much. If every possible resolution step has been made and nothing new can be derived, the set is **saturated**. A saturated set with no empty clause means the combined clauses are satisfiable, so the entailment fails — and the surviving clauses describe a valuation making the premises true while the conclusion is false. Failing to derive ∅ is a real answer, not a failure to finish.",
    "Resolution also connects backwards to the normal-form lessons. It only operates on clauses, which is why CNF conversion came first — the equivalence-rule method you practised there is precisely the preprocessing step this method depends on.",
    "Compared to semantic trees, resolution is the same question approached from the other side. Trees decompose a proposition looking for an assignment that satisfies it; resolution combines clauses looking for a contradiction. Both answer satisfiability, one by construction and one by refutation.",
  ],
  examples: [
    "The resolution rule:\nC₁ ∪ {pᵢ}  and  C₂ ∪ {¬pᵢ}\n⟶ resolvent: C₁ ∪ C₂",
    "One pair per step, and why:\n{P, Q} and {¬P, ¬Q}\nResolving on P gives {Q, ¬Q} — a tautology, not ∅.\nCancelling both pairs at once would give ∅, wrongly claiming these clauses conflict. P=1, Q=0 satisfies both.",
    "A refutation proof:\nPremises: {p₀}, {¬p₀, p₁}\nConclusion: p₁\n\n1. {p₀}          (assumption)\n2. {¬p₀, p₁}     (assumption)\n3. {¬p₁}         (assumption — negated conclusion)\n4. {p₁}          (resolution, lines 1 and 2)\n5. ∅             (resolution, lines 3 and 4)\nThe entailment holds.",
    "The two possible endings:\n∅ derived → the clause set is unsatisfiable → the entailment holds\nSaturated, no ∅ → the clause set is satisfiable → the entailment fails",
  ],
  definitions: [
    "Clause = A finite set of literals; the empty set counts as one",
    "Resolvent = The clause C₁ ∪ C₂ obtained by cancelling one complementary pair between two clauses",
    "Empty Clause (∅) = A clause no valuation can satisfy, marking a contradiction",
    "Saturation = The state where every available resolution step has been made and nothing new can be derived",
    "Refutation Proof = Establishing Γ ⊨ φ by showing Γ ∪ {¬φ} is unsatisfiable",
  ],
}

export default partInstructions
