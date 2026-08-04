import { MODULE_NAMES } from "../constants"

export const taskInstructions = {
  [MODULE_NAMES.WORDS_TO_PROPOSITIONS]: {
    instruction:
      "Turn these statements in to propositions. Definitions tells you how to turn these statements to symbols. Remember to use brackets to order your statement",
  },
  [MODULE_NAMES.SUBFORMULA]: {
    instruction:
      "Break down these formulas in to smaller subformulas by pressing on the operator symbols. When there are only atomic formulas left submit your answer.",
  },
  [MODULE_NAMES.TRUTH_TABLE_TASK]: {
    instruction:
      "Create a truth table for every proposition given. You can break them down with the subformula editor. Use 1 and 0 for true and false",
  },
  [MODULE_NAMES.EQUIVALENCE_RULES_TASK]: {
    instruction:
      "Change these propositions to fit the given task. Only apply one instance of a rule at a time. Make sure that the propositions are always equivalent",
  },
  [MODULE_NAMES.TT_METHOD_CONVERSION]: {
    instruction:
      "Build the truth table and write the normal form answer (DNF or CNF) in the extra field. Remember to create the answer from the truth table line by line.",
  },
  [MODULE_NAMES.EQUIVALENCE_METHOD_TRANSFORM]: {
    instruction:
      "Change these propositions to expected normal form. Only apply one instance of a rule at a time. Make sure that the propositions are always equivalent. Remember rules of distribution",
  },
  [MODULE_NAMES.RESOLUTION_INTRODUCTION]: {
    instruction:
      "Remember to use the clause format like: {A, ¬B} (assumption) or after a resolution step: {A, ¬B} (lines: 1,2) to reference where that step takes place.",
  },
  [MODULE_NAMES.RESOLUTION_REFUTATION]: {
    instruction: "Remember to use the clause format.",
  },
  [MODULE_NAMES.SHORTHAND_TASK]: {
    instruction: "Task: Fully expand by opening one shorthand at a time.",
  },
  [MODULE_NAMES.MULTIPLE_CHOISE_NATURAL_DEDUCTION]: {
    instruction: "Choose the correct answer from the given options",
  },
  [MODULE_NAMES.BASIC_RULES_NATURAL_DEDUCTION]: {
    instruction: "Remember the rules: ∧I, ∧E,∨I, →E, ¬E and premise",
  },
  [MODULE_NAMES.ASSUMPTIONS_AND_DISCHARGE_NATURAL_DEDUCTION]: {
    instruction: "Create an indentation by typing '+'",
  },
}
