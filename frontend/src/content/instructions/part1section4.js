const partInstructions = {
  title:
    "Equivalence Rules: Rewriting Propositions Without Changing Their Meaning",
  introduction:
    "Many logical formulas that look different are actually saying the same thing. An equivalence rule lets us rewrite a proposition into another form while keeping its truth value identical in every possible case. This is useful for simplifying formulas, comparing them, or preparing them for further logical work.",
  paragraphs: [
    "Two formulas are **logically equivalent** (written A ≡ B) if they have the same truth value in every row of their truth table. If you swap one for the other anywhere inside a larger formula, the meaning of the whole formula does not change. This is the foundation of every rewriting rule in this lesson.",
    "**Double negation** removes a pair of negations sitting in front of the same variable. If a formula is negated twice, the two negations cancel out and only the original variable remains.",
    "**Implication elimination** rewrites an arrow (→) as a disjunction. An implication P → Q is only false when P is true and Q is false, which is exactly the same condition under which ¬P ∨ Q is false. So the two forms always match.",
    "**Biconditional elimination** rewrites a ↔ symbol using connectives we already know how to work with. It can be split into two implications that must both hold, or into a disjunction of two conjunctions describing the cases where both sides agree.",
    "The **contrapositive** reverses an implication and negates both sides. P → Q and ¬Q → ¬P always share the same truth value, even though they read in opposite directions. This rule is often used to make an implication easier to prove or evaluate.",
    "**De Morgan's laws** describe what happens when a negation is pushed through a conjunction or disjunction. Negating an AND flips it into an OR of negations, and negating an OR flips it into an AND of negations. In both cases the negation moves inward, the connective switches, and each individual variable gets negated.",
    "Step 1: identify which connective is on the outside of the part you want to rewrite (¬, →, ↔, ∧, or ∨).\nStep 2: pick the matching equivalence rule for that connective.\nStep 3: rewrite only that part, keeping the rest of the formula untouched.\nStep 4: if a negation now sits in front of a new ∧ or ∨, check whether De Morgan's law can be applied again.\nStep 5: repeat until no more rules apply or the formula reaches the form you need.",
  ],
  examples: [
    "Logical equivalence:\nA ≡ B means A and B have identical truth values in every row of their truth table.",
    "Double negation:\n¬¬P ≡ P",
    "Implication elimination:\nP → Q ≡ ¬P ∨ Q",
    "Biconditional elimination:\nP ↔ Q ≡ (P → Q) ∧ (Q → P)\nP ↔ Q ≡ (P ∧ Q) ∨ (¬P ∧ ¬Q)",
    "Contrapositive:\nP → Q ≡ ¬Q → ¬P",
    "De Morgan's laws:\n¬(P ∧ Q) ≡ ¬P ∨ ¬Q\n¬(P ∨ Q) ≡ ¬P ∧ ¬Q",
    "Worked example:\n¬(P → Q)\n[implication elimination]\n≡ ¬(¬P ∨ Q)\n[De Morgan's law]\n≡ ¬¬P ∧ ¬Q\n[double negation]\n≡ P ∧ ¬Q",
  ],
  definitions: [
    "Logical Equivalence = Two formulas that have identical truth values in every row of their truth table (A ≡ B)",
    "Conjunction = A formula joined by ∧ (AND) that is true only when both sides are true",
    "Disjunction = A formula joined by ∨ (OR) that is true when at least one side is true",
    "Contrapositive = Reversing and negating both sides of an implication: P → Q ≡ ¬Q → ¬P",
    "De Morgan's Laws = Rules for pushing a negation through ∧ or ∨, switching the connective and negating each part",
  ],
  moduleName: "Equivalence-Rules-Task",
}

export default partInstructions
