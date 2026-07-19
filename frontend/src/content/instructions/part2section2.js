const partInstructions = {
  title: "Semantic Trees: Seeing the Recursive Structure",
  introduction:
    "The recursive definition from the last lesson explained why a proposition is built in stages, and the shorthand-expansion exercise showed that concretely — turning a compact formula like G into its full expansion, one connective at a time. A semantic tree just takes that same staged structure and draws it, rather than writing it out as a chain of substitutions. Every proposition has exactly one such tree, and building it is really just the recursive definition, read visually instead of textually.",
  paragraphs: [
    "A **semantic tree** represents a proposition as a tree diagram: the **root** is the proposition's main connective (whichever connective was applied last, at the highest stage), each **branch** leads to one of that connective's arguments, and this repeats recursively until every branch ends in a **leaf** — a bare propositional symbol like p0 or p1, with nothing left to break down further.",
    "This is exactly the recursive definition again, just drawn instead of described. The base case (propositional symbols) becomes the leaves of the tree. The recursive case (building a larger proposition from smaller ones via a connective) becomes an internal node whose children are the smaller propositions it was built from. A proposition built at stage n has a tree that's n levels deep.",
    "Negation (¬) is the only connective with a single child, since it applies to just one proposition — its node has one branch going down. Every other connective (∧, ∨, →, ↔) is binary, so its node always has exactly two branches, one for each side.",
    "Building the tree for a proposition works the same way you'd break it into subformulas: find the main connective (the one applied last, sitting outside any enclosing parentheses), split the proposition into its argument(s) at that point, and repeat the process on each piece. This should feel familiar — it's the same operation the subformula-breakdown exercises from earlier already had you doing by hand.",
    "The shorthand-chain exercise from the previous lesson is a particularly clear way to see this, because each named shorthand corresponds to exactly one node in the tree, sitting at exactly the stage it was introduced. A",
    "Reading a semantic tree back into a written proposition works in reverse: start at the leaves, and combine each node with its children's connective, working back up toward the root. This reverse direction is exactly the shorthand-expansion process from the previous lesson, just performed on a diagram instead of a list of substitution steps.",
    "Step 1: identify the proposition's main connective — the one that would be undone last if you were expanding shorthands, or applied first if you were building the proposition from smaller pieces.\nStep 2: make that connective the root, with one branch per argument.\nStep 3: repeat this process on each branch's proposition, treating it as its own smaller tree.\nStep 4: stop a branch once it reaches a bare propositional symbol — that's a leaf, and needs no further splitting.",
  ],
  examples: [
    "A single connective:\nP ∧ Q\n\n      [∧]\n     /   \\\n   [P]   [Q]",
    "Negation has one branch:\n¬P\n\n   [¬]\n    |\n   [P]",
    "Nesting one level deeper:\n(P ∧ Q) → R\n\n        [→]\n       /    \\\n     [∧]    [R]\n    /   \\\n  [P]   [Q]",
    "The shorthand chain from the previous lesson, as a tree:\nA = p0, B = p1, C = (A ∧ B), D = ¬C, E = p2, F = (D ∨ E), G = (F → C)\n\n              [→]  ← G\n            /      \\\n         [∨]  ← F    [∧]  ← C\n        /    \\           /   \\\n     [¬] ← D  [p2] ← E [p0]←A [p1]←B\n       |\n     [∧] ← C\n     /   \\\n  [p0]←A [p1]←B",
    "Reading the tree back into a written proposition, bottom-up:\nLeaves: p0, p1, p0, p1, p2\nOne level up: (p0 ∧ p1) appears twice — once as C's own subtree, once reused inside D's subtree\nNext: ¬(p0 ∧ p1) — this is D\nNext: (¬(p0 ∧ p1) ∨ p2) — this is F\nRoot: ((¬(p0 ∧ p1) ∨ p2) → (p0 ∧ p1)) — this is G, matching the fully expanded form from the shorthand exercise exactly",
  ],
  definitions: [
    "Semantic Tree = A tree diagram representing a proposition, with connectives as internal nodes and propositional symbols as leaves",
    "Root = The topmost node of a semantic tree, corresponding to the proposition's main connective",
    "Leaf = A node with no children, corresponding to a bare propositional symbol",
    "Branch = An edge connecting a node to one of its arguments (one branch for ¬, two branches for ∧, ∨, →, ↔)",
    "Main Connective = The connective applied last when building the proposition — the one that becomes the root of its semantic tree",
  ],
  moduleName: "Semantic-Tree-Intro",
}

export default partInstructions
