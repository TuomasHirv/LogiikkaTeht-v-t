const partInstructions = {
  title: "Deconstructing Propositions into Subformulas",
  introduction:
    "When evaluating a complex logical expression, a computer doesn't read the whole string at once. It breaks the proposition down into a hierarchy of smaller pieces called subformulas. Understanding how to split a formula into its component branches is the secret to building truth tables, parsing syntax errors, and understanding exactly how data flows through a logic gate network.",
  paragraphs: [
    "**Every logic formula has a Main Connective, which is the very last operator applied when evaluating the statement.** To find subformulas, we identify this operator and split the statement at that exact point. If our main operator is a **Binary Operator** like AND, OR, Implication, or Biconditional, it requires two inputs. Therefore, it splits the proposition into two distinct subformula branches: a left child and a right child.",
    "In contrast, the Negation symbol is a **Unary Operator**, meaning it only acts upon a single input that follows it. When a negation is the main connective of a subformula, it does not split the logic into two paths. Instead, it creates a single, straight downward branch that strips away the NOT symbol to evaluate the inner proposition directly underneath it.",
    "**Parentheses are the ultimate authority in determining how a formula splits.** They act as protective shields, forcing the operators inside them to cluster together. An operator inside parentheses cannot be the main connective of the outer expression. By shifting where the brackets sit, you completely alter which operator is exposed as the root, changing a double-branch split into a single-branch split, or vice versa.",
    "By continuously repeating this splitting process on every subformula until only individual variable letters remain, you create a **Syntax Tree**. The individual variables at the very bottom are the atomic subformulas, which cannot be split any further. Here is what a complete fully-deconstructed formula tree looks like when all the rules are applied together.",
  ],
  examples: [
    "Expression: P ∧ Q\n\n      [ ∧ ] (Main)\n      /   \\\n    [P]   [Q]",
    "Expression: ¬(P ∨ Q)\n\n      [ ¬ ] (Main)\n        |\n      [ ∨ ]\n      /   \\\n    [P]   [Q]",
    "Expression A: ¬P ∧ Q (Main is ∧)\nExpression B: ¬(P ∧ Q) (Main is ¬)",
    "Expression: (P → Q) ∧ ¬R\n\n          [ ∧ ]\n         /     \\\n      [ → ]   [ ¬ ]\n      /   \\     |\n    [P]   [Q]  [R]",
  ],
  definitions: [
    "Binary Operators = ∧, ∨, →, ↔ (Create 2 branches)",
    "Unary Operators = ¬ (Creates 1 branch)",
    "Atomic Formulas = Individual variables like P, Q, R (Base leaves)",
    "Syntax Tree = A diagram that breaks a formula into its subformulas, showing how connectives combine variables into the full expression",
  ],
  moduleName: "subformula",
}

export default partInstructions
