import { lazy } from "react"

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"

export const ROUTES = {
  home: () => "/",
  login: () => "/login",
  register: () => "/register",
  userPage: () => "/userpage",
  instructions: (id, section) => `/part/${id}/section/${section}`,
  tasks: (id, section, moduleName) =>
    `/part/${id}/section/${section}/tasks/${moduleName}`,
}

export const ELIMINATION_LINE_LIMITS = { min: 1, max: 6 }
export const RESOLUTION_LINE_LIMITS = { min: 1, max: 10 }
export const SHORTHAND_CHAIN_LINE_LIMITS = { min: 1, max: 10 }

export const MODULE_COMPLETE_THRESHOLD = 0.8

export const MODULE_NAMES = {
  WORDS_TO_PROPOSITIONS: "words-to-propositions",
  SUBFORMULA: "subformula",
  TRUTH_TABLE_TASK: "Truth-Table-Task",
  EQUIVALENCE_RULES_TASK: "Equivalence-Rules-Task",
  TT_METHOD_CONVERSION: "TT-method-Conversion",
  EQUIVALENCE_METHOD_TRANSFORM: "Equivalence-method-Transform",
  RESOLUTION_INTRODUCTION: "Resolution-Introduction",
  RESOLUTION_REFUTATION: "Resolution-Refutation",
}

export const MODULE_ORDER = Object.values(MODULE_NAMES)
