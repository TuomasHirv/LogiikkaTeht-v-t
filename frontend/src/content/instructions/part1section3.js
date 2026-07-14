const partInstructions = {
  title: "Truth Tables: Testing Every Logical Case",
  introduction:
    "A truth table is a complete map of a logical formula. Instead of checking only one example input, we test every possible True/False combination for its atomic variables. This guarantees that we can see exactly when a formula is true, when it is false, and whether two formulas always match each other.",
  paragraphs: [
    "To build a truth table, first list every atomic variable in the formula. If there are n variables, the table must have 2^n rows. For example, with P and Q we need 4 rows: 11, 10, 01, 00. **These rows represent every possible situation the formula can be evaluated in.**",
    "Truth tables are useful because they remove guessing. You can prove whether an argument is valid, check if a formula is a **tautology** (always true), **contradiction** (always false), or **contingency** (sometimes true, sometimes false), and compare two formulas to see if they are **logically equivalent.**",
    "**Negation** (¬) flips the value of a single variable. Whatever P is, ¬P is the opposite. This is the only symbol that works on one variable instead of combining two.",
    "**Conjunction** (∧) combines two variables and is only true when both sides are true. If even one side is false, the whole conjunction becomes false.",
    "**Disjunction** (∨) combines two variables and is true when at least one side is true. It is only false when both sides are false.",
    "**Implication** (→) says that if the left side is true, the right side must also be true. The only case where an implication fails is when the left side is true but the right side is false; in every other case it holds.",
    "**Biconditional** (↔) is true whenever both sides have the same value, whether that is true or false. It fails whenever the two sides disagree.",
    "The fastest way to fill a truth table is to use **subformulas** as helper columns. Instead of evaluating a large formula in one jump, compute the inner parts first and reuse those results. This reduces mistakes and mirrors how a computer evaluates expressions step by step.",
    "Step 1: take the formula (P → Q) ∧ ¬P and list the atomic variables P and Q.\nStep 2: make the base rows represent all combinations.\nStep 3: combine the atomic variables with their parent symbol from the subformula tree.\nStep 4: calculate the value for this and add it to the table.\nStep 5: Continue this recursively until you have the original proposition and its truth values.",
  ],
  examples: [
    "Variable rows for P and Q:\n\nP | Q\n1 | 1\n1 | 0\n0 | 1\n0 | 0",
    "Use cases:\n- Validity checking\n- Tautology testing\n- Equivalence checking",
    "Truth table for ¬P:\n\nP | ¬P\n1 |  0\n0 |  1",
    "Truth table for P ∧ Q:\n\nP | Q | P ∧ Q\n1 | 1 |   1\n1 | 0 |   0\n0 | 1 |   0\n0 | 0 |   0",
    "Truth table for P ∨ Q:\n\nP | Q | P ∨ Q\n1 | 1 |   1\n1 | 0 |   1\n0 | 1 |   1\n0 | 0 |   0",
    "Truth table for P → Q:\n\nP | Q | P → Q\n1 | 1 |   1\n1 | 0 |   0\n0 | 1 |   1\n0 | 0 |   1",
    "Truth table for P ↔ Q:\n\nP | Q | P ↔ Q\n1 | 1 |   1\n1 | 0 |   0\n0 | 1 |   0\n0 | 0 |   1",
    "Expression: (P → Q) ∧ ¬P\n\n          [ ∧ ]\n         /     \\\n      [ → ]   [ ¬ ]\n      /   \\     |\n    [P]   [Q]  [P]",
    "Truth table for (P → Q) ∧ ¬P:\n\nP | Q | P → Q | ¬P | (P → Q) ∧ ¬P\n1 | 1 |   1   |  0 |       0\n1 | 0 |   0   |  0 |       0\n0 | 1 |   1   |  1 |       1\n0 | 0 |   1   |  1 |       1",
  ],
  definitions: [
    "Truth Table = A table listing every variable assignment and resulting formula value",
    "Validity = An argument is valid if there is no row where all premises are true and the conclusion is false",
    "Tautology = Formula that is true on every row",
    "Contradiction = Formula that is false on every row",
  ],
  moduleName: "Truth-Table-Task",
}

export default partInstructions
