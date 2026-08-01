// This file is AI-coded
const { test, describe } = require("node:test")
const assert = require("node:assert/strict")
const { setupTestDb, teardownTestDb, clearTestDb } = require("./setup")
const { MODULENAMES } = require("../constants")
const helperFunc = require("./answerHelperFunc")
const evaluator = require("../validation/matchAnswer.js")
const dbFunc = require("../database/dbFunc.js")

let app
let db

test.before(async () => {
  ;({ app, db } = await setupTestDb())
})

test.after(async () => {
  await teardownTestDb()
})

test.afterEach(async () => {
  await clearTestDb()
})

// These tests mock every evaluator function in validation/matchAnswer.js so
// they only check the router's own glue code: does it pass the right data
// into the evaluator, and does it turn the evaluator's result into the right
// HTTP response. The evaluators' own logic is covered by validation/test/.
describe("POST /api/answers/:id", () => {
  describe("WORDS_TO_PROPOSITIONS", () => {
    test("accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.WORDS_TO_PROPOSITIONS,
      )
      const taskId = taskIdList[0]
      const answer = "K ∧ A"
      const mock = t.mock.method(evaluator, "matchPropositions", () => ({
        accepted: true,
        feedback: "Pass",
      }))
      const dbMock = t.mock.method(dbFunc, "insertAnswer", () => null)
      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Pass",
      })
      assert.strictEqual(mock.mock.calls.length, 1)
      assert.deepEqual(mock.mock.calls[0].arguments, [answer, taskId])

      assert.strictEqual(dbMock.mock.calls.length, 1)
      const [, calledTaskId, storedAnswer, accepted, feedback] =
        dbMock.mock.calls[0].arguments
      assert.strictEqual(calledTaskId, taskId)
      assert.strictEqual(storedAnswer, JSON.stringify(answer))
      assert.strictEqual(accepted, true)
      assert.strictEqual(feedback, "Pass")
    })

    test("not accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.WORDS_TO_PROPOSITIONS,
      )
      const taskId = taskIdList[0]
      const answer = "K ∧ A"
      t.mock.method(evaluator, "matchPropositions", () => ({
        accepted: false,
        feedback: "Fail",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "Fail",
      })
    })

    test("syntax error never reaches the evaluator", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.WORDS_TO_PROPOSITIONS,
      )
      const taskId = taskIdList[0]
      const mock = t.mock.method(evaluator, "matchPropositions", () => ({
        accepted: true,
        feedback: "Pass",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, "AB")

      assert.strictEqual(response.status, 422)
      assert.ok(response.body.error)
      assert.strictEqual(mock.mock.calls.length, 0)
    })
  })

  describe("SUBFORMULA", () => {
    test("accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const userId = signupResponse.body.user.id
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.SUBFORMULA,
      )
      const taskId = taskIdList[0]
      const answer = { text: "P", locked: true, children: null }
      t.mock.method(evaluator, "matchSubFormula", () => ({
        accepted: true,
        feedback: "Pass",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Pass",
      })

      const result = await db.query(
        "SELECT is_correct, submitted_answer FROM answers WHERE user_id = $1 AND task_id = $2",
        [userId, taskId],
      )
      assert.strictEqual(result.rows[0].is_correct, true)
    })

    test("not accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.SUBFORMULA,
      )
      const taskId = taskIdList[0]
      const answer = { text: "P", locked: true, children: null }
      t.mock.method(evaluator, "matchSubFormula", () => ({
        accepted: false,
        feedback: "Wrong branch",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "Wrong branch",
      })
    })

    test("falls back to a default message when feedback is empty", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.SUBFORMULA,
      )
      const taskId = taskIdList[0]
      const answer = { text: "P", locked: true, children: null }
      t.mock.method(evaluator, "matchSubFormula", () => ({
        accepted: false,
        feedback: "",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(
        response.body.feedback,
        "served failed to evaluate answer",
      )
    })
  })

  describe("TRUTHTABLE_TASK", () => {
    test("accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.TRUTHTABLE_TASK,
      )
      const taskId = taskIdList[0]
      const answer = [["P", "1", "1", "0", "0"]]
      const mock = t.mock.method(evaluator, "matchTruthTable", () => ({
        accepted: true,
        feedback: "Pass",
      }))
      t.mock.method(dbFunc, "insertAnswer", () => null)

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Pass",
      })
      assert.deepEqual(mock.mock.calls[0].arguments, [answer, taskId])
    })

    test("not accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.TRUTHTABLE_TASK,
      )
      const taskId = taskIdList[0]
      const answer = [["P", "1", "1", "0", "0"]]
      t.mock.method(evaluator, "matchTruthTable", () => ({
        accepted: false,
        feedback: "Fail",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "Fail",
      })
    })
  })

  describe("EQUIVALENCE_RULES_TASK", () => {
    test("accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.EQUIVALENCE_RULES_TASK,
      )
      const taskId = taskIdList[0]
      const answer = ["¬¬P ∨ ¬¬Q", "P ∨ ¬¬Q"]
      const mock = t.mock.method(evaluator, "matchEquivalenceAnswer", () => ({
        accepted: true,
        feedback: "Pass",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Pass",
      })
      assert.deepEqual(mock.mock.calls[0].arguments, [
        answer,
        helperFunc.tasks[MODULENAMES.EQUIVALENCE_RULES_TASK].correct_answer
          .remove,
      ])
    })

    test("not accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.EQUIVALENCE_RULES_TASK,
      )
      const taskId = taskIdList[0]
      const answer = ["¬¬P ∨ ¬¬Q", "P ∨ ¬¬Q"]
      t.mock.method(evaluator, "matchEquivalenceAnswer", () => ({
        accepted: false,
        feedback: "bad step",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "bad step",
      })
    })
  })

  describe("TT_METHOD_CONVERSION", () => {
    test("accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.TT_METHOD_CONVERSION,
      )
      const taskId = taskIdList[0]
      const answer = "P ∧ Q ∧ R"
      const fixture = helperFunc.tasks[MODULENAMES.TT_METHOD_CONVERSION]
      // matchTTFormAnswer isn't awaited by the router, so the mock must
      // return a plain object rather than a Promise (an async fn here would
      // silently break accepted.accepted downstream).
      const mock = t.mock.method(evaluator, "matchTTFormAnswer", () => ({
        accepted: true,
        feedback: "Pass",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Pass",
      })
      assert.deepEqual(mock.mock.calls[0].arguments, [
        answer,
        fixture.correct_answer.groups,
        fixture.correct_answer.form,
      ])
    })

    test("not accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.TT_METHOD_CONVERSION,
      )
      const taskId = taskIdList[0]
      const answer = "P ∧ Q ∧ R"
      t.mock.method(evaluator, "matchTTFormAnswer", () => ({
        accepted: false,
        feedback: "wrong clauses",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "wrong clauses",
      })
    })
  })

  describe("EQUIVALENCE_METHOD_TRANSFORM", () => {
    test("rejected rule change short-circuits before checking the form", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.EQUIVALENCE_METHOD_TRANSFORM,
      )
      const taskId = taskIdList[0]
      const answer = ["(P → Q) ∧ R", "(¬P ∨ Q) ∧ R"]
      const fixture = helperFunc.tasks[MODULENAMES.EQUIVALENCE_METHOD_TRANSFORM]
      const ruleMock = t.mock.method(
        evaluator,
        "matchEquivalenceAnswer",
        () => ({
          accepted: false,
          feedback: "bad rule",
        }),
      )
      const formMock = t.mock.method(evaluator, "checkIfCorrectForm", () => ({
        accepted: true,
        feedback: "Pass",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "bad rule",
      })
      assert.deepEqual(ruleMock.mock.calls[0].arguments, [
        answer,
        fixture.correct_answer.remove,
      ])
      assert.strictEqual(formMock.mock.calls.length, 0)
    })

    test("accepted rule change then checks the form", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.EQUIVALENCE_METHOD_TRANSFORM,
      )
      const taskId = taskIdList[0]
      const answer = ["(P → Q) ∧ R", "(¬P ∨ Q) ∧ R"]
      const fixture = helperFunc.tasks[MODULENAMES.EQUIVALENCE_METHOD_TRANSFORM]
      t.mock.method(evaluator, "matchEquivalenceAnswer", () => ({
        accepted: true,
        feedback: "Pass",
      }))
      // checkIfCorrectForm isn't awaited either, so it also needs a plain
      // return value.
      const formMock = t.mock.method(evaluator, "checkIfCorrectForm", () => ({
        accepted: true,
        feedback: "Correct form",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Correct form",
      })
      assert.deepEqual(formMock.mock.calls[0].arguments, [
        answer.at(-1),
        fixture.correct_answer.form,
      ])
    })
  })

  describe("RESOLUTION_INTRODUCTION", () => {
    test("accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.RESOLUTION_INTRODUCTION,
      )
      const taskId = taskIdList[0]
      const answer = [["P"], ["¬P"], ["∅"]]
      const fixture = helperFunc.tasks[MODULENAMES.RESOLUTION_INTRODUCTION]
      // Not awaited by the router - must return a plain object.
      const mock = t.mock.method(evaluator, "matchResolutionTask", () => ({
        accepted: true,
        feedback: "Pass",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Pass",
      })
      assert.deepEqual(mock.mock.calls[0].arguments, [
        answer,
        fixture.correct_answer.assumption_count,
        fixture.correct_answer.clauses,
        fixture.correct_answer.assumptions,
      ])
    })

    test("not accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.RESOLUTION_INTRODUCTION,
      )
      const taskId = taskIdList[0]
      const answer = [["P"], ["¬P"]]
      t.mock.method(evaluator, "matchResolutionTask", () => ({
        accepted: false,
        feedback: "missing clause",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "missing clause",
      })
    })
  })

  describe("RECURSIVE_DEFINITION", () => {
    test("accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.RECURSIVE_DEFINITION,
      )
      const taskId = taskIdList[0]
      const answer = ["(A → B)", "(p0 → B)", "(p0 → p1)"]
      const fixture = helperFunc.tasks[MODULENAMES.RECURSIVE_DEFINITION]
      const mock = t.mock.method(evaluator, "validateShorthandtask", () => ({
        accepted: true,
        feedback: "Pass",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      // The accepted branch no longer hardcodes Pass.
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Pass",
      })
      assert.deepEqual(mock.mock.calls[0].arguments, [
        answer,
        [fixture.correct_answer.final, fixture.correct_answer.shorthands],
        fixture.question,
      ])
    })

    test("not accepted surfaces the evaluator's feedback", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.RECURSIVE_DEFINITION,
      )
      const taskId = taskIdList[0]
      const answer = ["(A → B)", "(p0 → B)"]
      t.mock.method(evaluator, "validateShorthandtask", () => ({
        accepted: false,
        feedback: "wrong expansion",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "wrong expansion",
      })
    })
  })

  describe("SEMANTIC_TREE_INTRO", () => {
    test("accepted", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.SEMANTIC_TREE_INTRO,
      )
      const taskId = taskIdList[0]
      const answer = { text: "P ∧ ¬P", locked: true, children: null }
      const fixture = helperFunc.tasks[MODULENAMES.SEMANTIC_TREE_INTRO]
      const mock = t.mock.method(evaluator, "checkSemanticTreeTask", () => ({
        accepted: true,
        feedback: "Pass",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      // The accepted branch hardcodes "Pass" here too.
      assert.deepEqual(response.body, {
        correct: true,
        answer,
        feedback: "Pass",
      })
      assert.deepEqual(mock.mock.calls[0].arguments, [
        answer,
        fixture.correct_answer.lines,
        fixture.question,
      ])
    })

    test("not accepted surfaces the evaluator's feedback", async (t) => {
      const signupResponse = await helperFunc.signup(app, "tester", "password")
      const token = signupResponse.body.token
      const taskIdList = await helperFunc.createTasksForTest(
        db,
        MODULENAMES.SEMANTIC_TREE_INTRO,
      )
      const taskId = taskIdList[0]
      const answer = { text: "P ∧ ¬P", locked: true, children: null }
      t.mock.method(evaluator, "checkSemanticTreeTask", () => ({
        accepted: false,
        feedback: "branch wrong",
      }))

      const response = await helperFunc.postAnswer(app, token, taskId, answer)

      assert.strictEqual(response.status, 200)
      assert.deepEqual(response.body, {
        correct: false,
        answer,
        feedback: "branch wrong",
      })
    })
  })
})
