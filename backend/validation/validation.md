## matchAnswer

Match answer is the main file for this module.
Its function are called by the answerHelper and then it in turn calls its own further validation functions.
Further functions use a system of throwing Errors when the users input is incorrect.
After this validation returns {accepted: boolean, feedback: string}
