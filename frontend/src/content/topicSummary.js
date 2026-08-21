export const topicSummary = {
  "Equivalence Rules": `Some statements are identical, but expressed in different ways. Equivalence rules help us change propositions into their equivalent counter parts.
  For example two not statements can be removed like this ¬¬P ≡ P to form a simpler equivalent proposition.`,
  "Truth Table": `A truth table is a chart that shows whether a statement is true or false in every possible situation. 
  You list the simple statements you're combining, write out one row for each combination of true and false they could take, and then work out the value of the whole statement in each row. `,
  "Natural Deduction": `Natural deduction is a way of proving a conclusion by starting from your premises and taking small, obviously valid steps until you reach it. 
  Each step follows a rule that tells you what you're allowed to write down next, given what you already have. 
  Instead of checking every possible situation, as a truth table does, you build a chain of reasoning that leads from the premises to the conclusion.`,
  "Normal Forms": `Normal forms are standard shapes that any statement can be rewritten into, so that logically equivalent statements end up looking alike and are easier to compare or process. 
  A statement is in conjunctive normal form (CNF) when it is a chain of "and"s joining pieces that are themselves chains of "or"s. 
  A statement is in disjunctive normal form (DNF) when it is the other way round: a chain of "or"s joining pieces that are themselves chains of "and"s.`,
  "Resolution Method": `Resolution method starts from a CNF and uses resolution steps to prove that a proposition is impossible. 
  If we assume the opposite of our conclusion and prove it impossible with the Resolution Method we know that our conclusion is correct`,
  Subformula: `A subformula is any complete statement sitting inside a larger one — a piece that would count as a well-formed statement on its own. 
  You find them by breaking the statement apart at each connective and collecting every part you get along the way, right down to the individual simple statements; 
  the whole statement counts as a subformula of itself too.`,
  "Semantic Tree": `A semantic tree (or tableau) is a method for testing whether a set of statements can all be true at once, by breaking them down and drawing out the situations they'd require. 
  You write the statements at the top and apply rules that decompose each one into simpler parts. 
  A branch closes when it contains both a statement and its negation. 
  If every branch closes the statement is a "contradiction".`,
}
