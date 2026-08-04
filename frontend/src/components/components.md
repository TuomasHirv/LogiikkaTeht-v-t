# Tasks:

## Tasks go through TaskScreen.jsx.

- It imports the task components and instruction content lazily since they are very heavy. There is some buffering on instruction content.
- First it gets the moduleName from parameters. (tasks are still empty so nothign renders)
- After this is loads the next instruction content for buffering.
- The second hook then gets the tasks assosiated with the moduleName from the database and maps them into the task component that was selected.
- This causes some loading time with the (suspense) since the components are loaded lazily.
- Task components are:
  TaskItem,
  SubFormulaTask,
  TruthTableTask,
  EliminationTask,
  NormalFormTask,
  ResolutionTask,
  ShorthandTask,
  SemanticTreeTask,
  MultipleChoiseTask,
  NaturalDeductionTask,

## Tasks components themselves.

- Task components handle submitting and loading the previous answers
- All tasks use hooks:
  useLastSavedAnswer,
  submitAnswer,
  useEffect for rendering last answer.
- From the zustand store the tasks take:
  Previous answer,
  Previous feedback,
  addAnswer,
  User
- Note after creating documentation: Maybe i could have made submit button its own component since it is quite uniform?
- All task components use the feedback component to render the feedback given.

## Everything else.

- ErrorScreen is in place so if the error happens the user isn't left guessing.
- HomeScreen that is rendered at "/"
- InstructionScreen renders the content files for the user with a simple styling component.
- UserScreen shows the users completed tasks and maps them from the constants.
- Login and Register screens are simple.
