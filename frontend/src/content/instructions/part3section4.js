const partInstructions = {
  title: "The Resolution Method: Proving Entailment by Refutation",
  introduction:
    "The previous lesson introduced the resolution step itself, and showed that a chain of resolutions sometimes collapses all the way down to the empty clause — a contradiction. This lesson explains why that's not just a curiosity, but the entire point of the method: resolution is used to prove that a conclusion follows from a set of premises by showing that assuming the opposite leads to contradiction. This is called a refutation proof, and it's how resolution connects back to the validity and entailment questions from your earlier truth-table lessons.",
  paragraphs: [
    "To show that premises Γ entail a conclusion φ, it's enough to show that Γ together with ¬φ is unsatisfiable — that there's no valuation making every clause in that combined set true at once. If assuming ¬φ alongside the premises always leads to contradiction, then ¬φ can never hold whenever the premises do, which means φ must hold whenever the premises do. That's exactly what entailment means.",
    "This is why the conclusion gets **negated** before anything else happens. The premises are converted to clause form as before, but the conclusion is first negated, then also converted to clause form, and added to the same set of clauses being worked with. The resolution method is then applied to this whole combined set — premises and negated conclusion together — searching for a path to the empty clause.",
    "If the search reaches the empty clause, the combined set was contradictory, which proves the original entailment: Γ ⊨ φ. If the search instead saturates — every possible resolution step has been exhausted and nothing new is left to derive, with no empty clause ever appearing — then the combined set is satisfiable after all, which means the entailment does **not** hold: there's some way for the premises to be true and the conclusion false at the same time.",
    "This gives refutation proofs the same two possible endings covered in the last lesson: reaching ∅ (success — the entailment holds), or reaching saturation without ∅ (failure — the entailment doesn't hold, and the students of resolution can go further to describe a specific valuation, read off the saturated set, that satisfies the premises while falsifying the conclusion).",
    "It's worth being precise about what's being negated. Only the conclusion φ gets negated — the premises Γ are added to the clause set exactly as they are, unchanged. Mixing this up (negating a premise instead of the conclusion, or forgetting to negate the conclusion at all) searches for contradiction in the wrong set entirely, and any empty clause found that way proves nothing about the intended entailment.",
    "Step 1: convert every premise in Γ to clause form, unchanged.\nStep 2: negate the conclusion φ, then convert ¬φ to clause form as well.\nStep 3: combine both sets of clauses into one working set.\nStep 4: apply resolution steps to this combined set, exactly as before.\nStep 5a: if the empty clause is reached, Γ ⊨ φ is proven.\nStep 5b: if the set saturates with no empty clause, Γ ⊨ φ does not hold.",
  ],
  examples: [
    "Why negation is the right move:\nΓ ⊨ φ means: whenever every clause in Γ is true, φ is also true.\nEquivalently: there's no valuation making every clause in Γ true and φ false — i.e. Γ ∪ {¬φ} is unsatisfiable.",
    "Worked example — proving p₀, p₀ → p₁ ⊨ p₁ (Modus Ponens again, now as a refutation):\nPremises: {p₀}, {¬p₀, p₁}\nConclusion to prove: p₁\nNegated conclusion, as a clause: {¬p₁}\n\n1. {p₀}            (assumption)\n2. {¬p₀, p₁}       (assumption)\n3. {¬p₁}           (assumption — the negated conclusion)\n4. {p₁}            (resolution from lines 1 and 2)\n5. ∅               (resolution from lines 3 and 4)\nThe empty clause is reached, so p₀, p₀ → p₁ ⊨ p₁ is proven.",
    "Worked example — an entailment that fails:\nPremises: {p}, {q}\nClaimed conclusion: ¬p\nNegated conclusion, as a clause: {p}\n\n1. {p}     (assumption)\n2. {q}     (assumption)\n3. {p}     (assumption — the negated conclusion; identical to line 1)\nNo complementary literals exist anywhere in this set — nothing further can be resolved.\nThe set is already saturated with no empty clause, so p, q ⊨ ¬p does not hold.",
    "Reading a falsifying valuation off a saturated set:\nFrom the example above, the saturated clause set {p}, {q} forces p = 1 and q = 1 for every clause to hold — which is exactly a valuation where the premises are true and the claimed conclusion ¬p is false, confirming the entailment fails.",
  ],
  definitions: [
    "Refutation Proof = A resolution proof that establishes Γ ⊨ φ by showing Γ ∪ {¬φ} is unsatisfiable",
    "Entailment (Γ ⊨ φ) = Every valuation that satisfies all of Γ also satisfies φ",
    "Negated Conclusion = ¬φ, added to the premise clauses as an extra assumption before running resolution",
    "Unsatisfiable = A clause set with no valuation that satisfies every clause in it; proven by deriving the empty clause",
    "Falsifying Valuation = A valuation read off a saturated (non-contradictory) clause set, showing the premises can be true while the conclusion is false",
  ],
  moduleName: "Resolution-Refutation",
}

export default partInstructions
