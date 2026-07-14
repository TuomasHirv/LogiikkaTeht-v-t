const partInstructions = {
  title:
    "Normal Forms: Converting Propositions to DNF and CNF (Equivalence-Rule Method)",
  introduction:
    "The previous lesson covered the truth-table method for reaching DNF or CNF — mechanical, reliable, but often produces long formulas. This lesson covers the second route: the equivalence-rule method, which starts from the proposition itself rather than its truth table, and reuses the rewrite rules from earlier lessons. It usually reaches a shorter result, but takes more care to apply correctly. Since CNF is the format the resolution method requires, get comfortable with this route in particular — it's the one you'll be leaning on most going forward.",
  paragraphs: [
    "The equivalence-rule method works in stages, each one peeling away a layer of structure until only literals combined with ∧ and ∨ remain. The first stage is to **eliminate → and ↔**, using implication elimination and biconditional elimination. After this stage, the formula contains only ¬, ∧, and ∨.",
    "The second stage is to **push all negations inward** until each one sits directly in front of a variable, using De Morgan's laws and double negation. A negation sitting in front of a parenthesized group gets pushed through it — ∧ flips to ∨ (or vice versa) and the negation lands on each piece inside. This repeats until every ¬ is directly attached to a single variable, with nothing else negated.",
    "At this point the formula is built entirely from literals joined by ∧ and ∨ — but it isn't necessarily in normal form yet, since ∧ and ∨ can still be nested inside each other in the wrong order. The third stage fixes this using the **distributive laws**, which describe how ∧ and ∨ distribute over one another.",
    "Distributing ∨ over ∧ pushes a formula toward CNF: whenever you see something like P ∨ (Q ∧ R), it becomes (P ∨ Q) ∧ (P ∨ R) — a conjunction of two disjunctions, which is exactly the CNF shape. Distributing ∧ over ∨ does the mirror operation and pushes toward DNF instead.",
    "This distribution step may need to be applied more than once. Each application only handles one instance of a disjunction sitting outside a conjunction (or vice versa) — if the formula has several such spots, or if distributing creates a new one, keep applying the rule until no more mixed nesting remains.",
    "Step 1: eliminate → and ↔ using implication and biconditional elimination.\nStep 2: push negations inward with De Morgan's laws and double negation, until every ¬ sits directly on a variable.\nStep 3: decide whether you're targeting CNF or DNF.\nStep 4: apply the matching distributive law repeatedly — ∨ over ∧ for CNF, ∧ over ∨ for DNF — until no mixed nesting remains.\nStep 5: the result is a single ∧ of ∨-clauses (CNF) or a single ∨ of ∧-clauses (DNF).",
    "Because this method rewrites the formula directly rather than reading off a table, the result is often much more compact than the truth-table version — especially as the number of variables grows, since the truth-table method's output size is tied to the number of rows, while this method's output size is tied to the formula's own structure.",
    "The tradeoff is that each stage requires correctly spotting which rule applies and applying it without changing anything else in the formula. A mistake at any stage — missing a negation that needed to be pushed further, or stopping distribution too early — produces a formula that looks like a normal form but isn't equivalent to the original.",
  ],
  examples: [
    "Distributive laws:\nP ∨ (Q ∧ R) ≡ (P ∨ Q) ∧ (P ∨ R)\nP ∧ (Q ∨ R) ≡ (P ∧ Q) ∨ (P ∧ R)",
    "Worked example — converting to CNF:\n¬(P ∧ Q) ∨ R\n[De Morgan's law]\n≡ (¬P ∨ ¬Q) ∨ R\n≡ ¬P ∨ ¬Q ∨ R\nAlready CNF: a single clause of three literals, since no ∧ remained after the negation was pushed in.",
    "Worked example — a case requiring distribution:\n(P ∧ Q) ∨ R\nHere the ∨ sits outside a ∧, which is not CNF shape yet.\n[distribute ∨ over ∧]\n≡ (P ∨ R) ∧ (Q ∨ R)\nNow it's a conjunction of two clauses — CNF.",
    "Worked example — full pipeline from an implication:\n¬(P → Q) ∨ R\n[implication elimination]\n≡ ¬(¬P ∨ Q) ∨ R\n[De Morgan's law]\n≡ (¬¬P ∧ ¬Q) ∨ R\n[double negation]\n≡ (P ∧ ¬Q) ∨ R\n[distribute ∨ over ∧]\n≡ (P ∨ R) ∧ (¬Q ∨ R)",
    "Worked example — converting the same formula to DNF instead:\n(P ∧ ¬Q) ∨ R\nThis is already DNF as written — a disjunction of two groups, (P ∧ ¬Q) and the single literal R — no distribution needed, since the ∧ is already nested inside the ∨, not the other way around.",
  ],
  definitions: [
    "Equivalence-Rule Method = Deriving a normal form by rewriting a proposition directly using equivalence rules, rather than reading it off a truth table",
    "Distributive Laws = Rules describing how ∧ and ∨ distribute over each other, used to reshape a formula into CNF or DNF",
    "Mixed Nesting = A ∨ sitting outside a ∧ (or vice versa) that hasn't yet been resolved by distribution, meaning the formula isn't in normal form yet",
    "Conjunctive Normal Form (CNF) = A conjunction of disjunctions of literals, reached here by distributing ∨ over ∧",
    "Disjunctive Normal Form (DNF) = A disjunction of conjunctions of literals, reached here by distributing ∧ over ∨",
  ],
  moduleName: "Equivalence-method-Transform",
}

export default partInstructions
