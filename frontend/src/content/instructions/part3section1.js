const partInstructions = {
  title: "Normal Forms: Converting Propositions to DNF and CNF",
  introduction:
    "A normal form is a standardized shape that any proposition can be rewritten into. Two of the most useful shapes are disjunctive normal form (DNF) and conjunctive normal form (CNF). Putting a formula into one of these forms doesn't change what it means — it just makes its structure predictable, which is exactly what later logical procedures need. CNF in particular will be the required input format for the resolution method coming up, so getting comfortable producing it is worth extra attention here. There are two common ways to derive a normal form: the truth-table method and the equivalence-rule method. This lesson covers the truth-table method; the equivalence-rule method is covered in the next section.",
  paragraphs: [
    "A **literal** is a variable or its negation — P and ¬P are both literals, but ¬¬P or P ∧ Q are not. Every normal form is built out of literals combined in a specific pattern.",
    "**Disjunctive normal form (DNF)** is a disjunction of conjunctions of literals — an OR of AND-groups, such as (P ∧ Q) ∨ (¬P ∧ R). Each parenthesized group is sometimes called a conjunctive clause.",
    "**Conjunctive normal form (CNF)** is a conjunction of disjunctions of literals — an AND of OR-groups, such as (P ∨ Q) ∧ (¬P ∨ R). Each parenthesized group is called a disjunctive clause, or just a clause. This is the form the resolution method operates on directly, since resolution works by combining pairs of clauses.",
    "The **truth-table method** builds the full truth table for the proposition, then reads the normal form directly off the rows where the formula lands on a particular value. For DNF, look at every row where the formula is 1. For each of those rows, write a conjunction of the variables, using the variable itself if it's 1 in that row and its negation if it's 0. Then join all of those conjunctions with ∨.",
    "For CNF, the process mirrors DNF but starts from the rows where the formula is 0. For each such row, write a disjunction of the variables, but flip the sign of each one: use the negation if the variable is 1 in that row, and the variable itself if it's 0. Then join all of those disjunctions with ∧.",
    "This flip is the part that catches people off guard the first time. It makes sense once you check it against the truth table: a disjunctive clause is false only when every literal inside it is false, so to make a clause that's false on exactly one specific row, each literal in it has to be the opposite of what's true in that row.",
    "Step 1: build the full truth table for the proposition.\nStep 2: decide whether you're building DNF or CNF.\nStep 3 (DNF): for every row where the formula is 1, write a conjunction of literals matching that row's values directly.\nStep 3 (CNF): for every row where the formula is 0, write a disjunction of literals with each value flipped.\nStep 4: join the clauses from step 3 with ∨ (for DNF) or ∧ (for CNF).\nStep 5: if there are no rows equal to 1, the DNF is simply a contradiction; if there are no rows equal to 0, the CNF is simply a tautology.",
    "The truth-table method is mechanical and hard to get wrong, since it never requires spotting which rewrite rule applies — but it can produce long formulas when a proposition has many variables or many 1/0 rows. The equivalence-rule method, covered next, usually reaches a shorter result but takes more practice to apply correctly.",
  ],
  examples: [
    "Literal:\nP and ¬P are literals. ¬¬P and P ∧ Q are not.",
    "DNF example:\n(P ∧ Q) ∨ (¬P ∧ R)",
    "CNF example:\n(P ∨ Q) ∧ (¬P ∨ R)",
    "Truth table for P ∧ (Q ∨ R):\n\nP | Q | R | P ∧ (Q ∨ R)\n1 | 1 | 1 |      1\n1 | 1 | 0 |      1\n1 | 0 | 1 |      1\n1 | 0 | 0 |      0\n0 | 1 | 1 |      0\n0 | 1 | 0 |      0\n0 | 0 | 1 |      0\n0 | 0 | 0 |      0",
    "Worked example — DNF from the table above:\nRows equal to 1: (1,1,1), (1,1,0), (1,0,1)\nDNF: (P ∧ Q ∧ R) ∨ (P ∧ Q ∧ ¬R) ∨ (P ∧ ¬Q ∧ R)",
    "Worked example — CNF from the same table:\nRows equal to 0: (1,0,0), (0,1,1), (0,1,0), (0,0,1), (0,0,0)\nFlipping each row's values and joining with ∨ inside, ∧ between:\n(¬P ∨ Q ∨ R) ∧ (P ∨ ¬Q ∨ ¬R) ∧ (P ∨ ¬Q ∨ R) ∧ (P ∨ Q ∨ ¬R) ∧ (P ∨ Q ∨ R)",
  ],
  definitions: [
    "Literal = A variable or its negation (P or ¬P)",
    "Disjunctive Normal Form (DNF) = A disjunction of conjunctions of literals, e.g. (P ∧ Q) ∨ (¬P ∧ R)",
    "Conjunctive Normal Form (CNF) = A conjunction of disjunctions of literals, e.g. (P ∨ Q) ∧ (¬P ∨ R)",
    "Clause = A single disjunction of literals within a CNF formula",
    "Truth-Table Method = Deriving a normal form by reading DNF off the rows equal to 1 or CNF off the rows equal to 0 (with each literal's sign flipped) of a formula's truth table",
  ],
  moduleName: "TT-method-Conversion",
}

export default partInstructions
