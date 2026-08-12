const partInstructions = {
  title: "Turning natural language in to propositions",
  introduction:
    "Propositional logic is the foundation of computer science and formal reasoning. It allows us to take ambiguous real-world statements and translate them into precise mathematical formulas that a computer can evaluate with complete certainty. By stripping away language barriers, we can systematically test whether a complex argument or code condition is fundamentally true or false. To do this, we map simple declarative sentences to uppercase variable letters like P or Q, which we call propositions. We then connect them using logical operators.",
  paragraphs: [
    "**AND** statement is represented the by **∧**. If i say 'i overslept and i am late' it could be represented as",
    "**OR** statement is represented the by symbol **∨**. If i say 'i either overslept or i am early' it could be represented as",
    "**NOT** statement is represented the by symbol **¬**. I could also say 'i either overslept or i am not late' representing it as",
    "An **IF-THEN** conditional statement is represented by the arrow symbol **→**. If i want to say 'If i oversleep i will be late' i could write",
    `**IF AND ONLY IF** relationship uses the double-arrow symbol **↔**. This asserts that two statements are both true or both false at the sametime. If i say 'I am only late when i oversleep and i only oversleep when i am late' i could write`,
    "**Parenthesis change the structure of the proposition.** By adding or changing them we also change the meaning. 'I am either early or i have overslept and i am late'",
    "If i swap the parenthesis we get this. *Can you see why it doesn't make sense?*",
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
}

export default partInstructions
