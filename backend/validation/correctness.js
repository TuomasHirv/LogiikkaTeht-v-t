function validatePropositional(input) {
  const removedSpaces = input.replace(/\s+/g, "")
  const variableSpacingCheck = /[A-Za-z]{2,}/

  if (variableSpacingCheck.test(removedSpaces)) {
    return false
  }
  const allowedSymbolsCheck = /^([A-Za-z\s()∧∨¬→↔])+$/

  if (!allowedSymbolsCheck.test(input)) {
    return false
  }
  return true
}

module.exports = validatePropositional
