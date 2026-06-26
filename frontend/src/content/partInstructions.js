export const partInstructions = {
  1: {
    1: {
      title: "Turning natural language in to propositions",
      introduction:
        "Propositional logic is the foundation of computer science and formal reasoning. It allows us to take ambiguous real-world statements and translate them into precise mathematical formulas that a computer can evaluate with complete certainty. By stripping away language barriers, we can systematically test whether a complex argument or code condition is fundamentally true or false. To do this, we map simple declarative sentences to uppercase variable letters like P or Q, which we call propositions. We then connect them using logical operators.",
      paragraphs: [
        "AND statement is represented the by ∧. If i say 'i overslept and i am late' it could be represented as",
        "OR statement is represented the by symbol ∨. If i say 'i either overslept or i am early' it could be represented as",
        "NOT statement is represented the by symbol ¬. I could also say 'i either overslept or i am not late' representing it as",
        "An IF-THEN conditional statement is represented by the arrow symbol →. If i want to say 'If i oversleep i will be late' i could write",
        `IF AND ONLY IF relationship uses the double-arrow symbol ↔. This asserts that two statements are both true or both false at the sametime. 
      If i say 'I am only late when i oversleep and i only oversleep when i am late' i could write`,
        "Parenthesis change the structure of the proposition. By adding or changing them we also change the meaning. 'I am either early or i have overslept and i am late'",
        "If i swap the parenthesis we get this. Can you see why it doesn't make sense?",
      ],
      examples: [
        "O ∧ L",
        "O ∨ E",
        "O ∨ ¬L",
        "O → L",
        "O ↔ L",
        "E ∨ (O ∧ L)",
        "(E ∨ O) ∧ L",
      ],
      definitions: ["O = 'I oveslept'", "L = 'I am late'", "E = 'I am early'"],
      moduleName: "words-to-propositions",
    },
    2: {
      title: "Deconstructing Propositions into Subformulas",
      introduction:
        "When evaluating a complex logical expression, a computer doesn't read the whole string at once. It breaks the proposition down into a hierarchy of smaller pieces called subformulas. Understanding how to split a formula into its component branches is the secret to building truth tables, parsing syntax errors, and understanding exactly how data flows through a logic gate network.",
      paragraphs: [
        "Every logic formula has a Main Connective, which is the very last operator applied when evaluating the statement. To find subformulas, we identify this operator and split the statement at that exact point. If our main operator is a Binary Operator like AND, OR, Implication, or Biconditional, it requires two inputs. Therefore, it splits the proposition into two distinct subformula branches: a left child and a right child.",
        "In contrast, the Negation symbol is a Unary Operator, meaning it only acts upon a single input that follows it. When a negation is the main connective of a subformula, it does not split the logic into two paths. Instead, it creates a single, straight downward branch that strips away the NOT symbol to evaluate the inner proposition directly underneath it.",
        "Parentheses are the ultimate authority in determining how a formula splits. They act as protective shields, forcing the operators inside them to cluster together. An operator inside parentheses cannot be the main connective of the outer expression. By shifting where the brackets sit, you completely alter which operator is exposed as the root, changing a double-branch split into a single-branch split, or vice versa.",
        "By continuously repeating this splitting process on every subformula until only individual variable letters remain, you create a Syntax Tree. The individual variables at the very bottom are the atomic subformulas, which cannot be split any further. Here is what a complete fully-deconstructed formula tree looks like when all the rules are applied together.",
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
      ],
      moduleName: "subformula",
    },
  },
}
