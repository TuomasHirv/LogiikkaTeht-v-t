# index.js

- Index exports 4 different hooks:
  useField
  useResolutionField
  useNaturalDeductionField
  useSimpleField
- These hooks are used as text fields with additional characteristics
- They all return:
  inputProps: { type, value, onChange }
  reset (removes the inputProps.value)
  syntaxError (syntax error notification as a string)
  checkSyntax (function that checks for syntax errors)

- their parameter options = {} Changes their behaviour to suit their purpose.
- transform: is a function that replaces characters with the used propositional symbols.
- validate: is a function that reads the inputProps.value and updates the value of syntaxError

- There is a lot of regex here. I understand it but it was largely created by LLM:s

# lineList.js

- Many components (EliminationTask, NaturalDeductionTask, ResolutionTask, ShortHandTask) use it.
- It centralizes functions like:
  change: Easier to change a singular part of the list.
  addRemove: Easier to add a new part to the list if it is in the allowed range.

# savedAnswer.js

- Is a helper for rendering previous answers and feedback.

# submitAnswer.js

submitTaskAnswer:

- Used in all task components.
- It gets the components own setFeedback and the rest of the required parameters.
  -> then calls answerService to post the answer to backend
  --> (on Success) adds the answer to the store
  ---> Creates feedback with createPassFailFeedback
  --> (on error) Creates feedback with buildSubmissionErrorFeedback

# useTaskHooks.js

Gets the past answer as a parameter and from there builds feedback and parses the answer to be rendered
