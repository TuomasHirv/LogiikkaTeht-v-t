const partInstructions = {
  title: "The Resolution Method: The Resolution Step",
  introduction:
    "Resolution is a single, mechanical rule for combining two clauses into a new one — and it's the engine behind an entire proof procedure. Unlike the equivalence rules from earlier lessons, which rewrite one formula into an equivalent one, resolution combines two separate clauses and produces a third clause that both original clauses guarantee. This lesson introduces the rule itself, why it's trustworthy, and how applying it repeatedly lets you chain several clauses together into something new.",
  paragraphs: [
    "Resolution works on **clauses** — the same disjunctions of literals from the CNF lessons, but here it's more precise to think of a clause as a finite *set* of literals rather than a written-out disjunction. A clause C is satisfied by a truth valuation v when v(C) = 1. This extends naturally to a whole collection of clauses: a set of clauses 𝒞 is satisfied by v exactly when v(C) = 1 for every single clause C in 𝒞 — one exception anywhere and the whole collection fails.",
    "Because a clause is defined as a finite set, the empty set itself counts as a clause. This gives the **empty clause**, written ∅ or □. By definition, no valuation v can ever make ∅ true — v(∅) = 0 for every v, with no exceptions, since there are no literals in it that could be satisfied. This is exactly why the empty clause plays the role of the false constant ⊥ in resolution: reaching it means a contradiction has been derived.",
    "The mirror case is worth noting too: an empty *collection* of clauses (a set of clauses with nothing in it) is automatically satisfied by every valuation, since satisfying a collection just means every clause inside it holds — and vacuously, that's true when there's nothing to check. An empty clause collection is a tautology, for exactly the same reason a universally-quantified statement over an empty domain is vacuously true.",
    "The **resolution rule** itself, written in set notation: given a clause C₁ ∪ {pᵢ} and a clause C₂ ∪ {¬pᵢ}, the resolvent is C₁ ∪ C₂. This is the same rule described earlier — pᵢ and ¬pᵢ are the complementary pair being removed, and C₁, C₂ are simply 'everything else' in each clause, joined together in the result. Writing it this way makes clear that resolution operates on the clauses as sets: order doesn't matter, and if a literal happens to appear in both C₁ and C₂, the union naturally keeps only one copy.",
    "A **resolution proof** is a numbered sequence of clauses, where each line is either an assumption (a clause taken directly from the premises) or the resolvent of two earlier lines, with those two line numbers cited as justification. A resolution proof that ends in the empty clause is a proof that the assumptions, taken together, are contradictory — this is the basis for the refutation-style proofs covered in the next lesson.",
    "Step 1: convert every premise into clause form (a set of literals).\nStep 2: find two clauses containing a complementary pair pᵢ and ¬pᵢ.\nStep 3: form the resolvent C₁ ∪ C₂, dropping the complementary pair.\nStep 4: write the resolvent as a new numbered line, citing the two lines it came from.\nStep 5: repeat using any two available lines — original assumptions or earlier resolvents — until no more useful steps remain.",
  ],
  examples: [
    "Definition — satisfaction extended to a clause set:\nv(𝒞) = 1 if and only if v(C) = 1 for every clause C ∈ 𝒞.",
    "Definition — the empty clause:\n∅ is a clause (clauses are finite sets, so the empty set qualifies).\nv(∅) = 0 for every valuation v — the empty clause is a contradiction, playing the role of ⊥.",
    "Definition — the empty clause collection:\nAn empty collection of clauses is a tautology, since a collection is satisfied when every clause in it holds, and there are none to fail.",
    "Resolution rule in set notation:\nC₁ ∪ {pᵢ}   and   C₂ ∪ {¬pᵢ}\n     ⟶ resolvent: C₁ ∪ C₂",
    "Worked example — proving Modus Ponens by resolution:\nClaim: if p₀ and p₀ → p₁, then p₁.\nFirst convert the implication to clause form: p₀ → p₁ ⇔ ¬p₀ ∨ p₁, so the assumptions become the clauses {p₀} and {¬p₀, p₁}.\n\n1. {p₀}          (assumption)\n2. {¬p₀, p₁}     (assumption)\n3. {p₁}          (resolution from lines 1 and 2)",
    "Worked example — a chain reaching the empty clause:\n1. {p}            (assumption)\n2. {¬p, q}        (assumption)\n3. {¬q}           (assumption)\n4. {q}            (resolution from lines 1 and 2)\n5. ∅              (resolution from lines 3 and 4)",
  ],
  definitions: [
    "Clause = A finite set of literals, e.g. {P, ¬Q, R}",
    "Clause Set (𝒞) = A collection of clauses; satisfied by a valuation v exactly when every clause in it is satisfied by v",
    "Resolution Rule = From C₁ ∪ {pᵢ} and C₂ ∪ {¬pᵢ}, derive the resolvent C₁ ∪ C₂",
    "Empty Clause (∅ or □) = The clause with no literals; never satisfied by any valuation, so it represents a contradiction (⊥)",
    "Resolution Proof = A numbered sequence of clauses, each either an assumption or a resolvent of two earlier lines, with its justification citing those line numbers",
  ],
  moduleName: "Resolution-Introduction",
}

export default partInstructions
