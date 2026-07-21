const testNodeOneAnd = {
  text: "p ∧ a",
  children: [{ text: "p", children: [{ text: "a", children: null }] }],
}
const testNodeOneAndContradiction = {
  text: "p ∧ ¬p",
  children: [
    {
      text: "p",
      children: [{ text: "¬p", children: [{ text: "X", children: null }] }],
    },
  ],
}

const bigTest = {
  text: "(P ↔ Q) ∧ ¬P",
  children: [
    {
      text: "¬P",
      children: [
        {
          text: "(P ↔ Q)",
          children: [
            {
              text: "¬P ∧ ¬Q",
              children: [
                { text: "¬P", children: [{ text: "¬Q", children: null }] },
              ],
            },
            {
              text: "P ∧ Q",
              children: [
                { text: "P", children: [{ text: "X", children: null }] },
              ],
            },
          ],
        },
      ],
    },
  ],
}

const throwsOnIncorrectX = {
  text: "p ∧ a",
  children: [{ text: "X", children: null }],
}

const throwsOnIncorrectFork = {
  text: "p ∨ a",
  children: [{ text: "p", children: [{ text: "a", children: null }] }],
}

const throwsOnNotInPending = {
  text: "p ∨ a",
  children: [
    { text: "p", children: null },
    { text: "c", children: null },
  ],
}

const throwsOnNotExhausted = {
  text: "p ∨ a",
  children: [{ text: "p", children: null }],
}

const throwsOnContradictionNotMarked = {
  text: "p ∧ ¬p",
  children: [
    {
      text: "p",
      children: [{ text: "¬p", children: null }],
    },
  ],
}

const throwsOnForkWhenChain = {
  text: "p ∧ p",
  children: [
    { text: "p", children: null },
    { text: "p", children: null },
  ],
}

const throwsOnVarFork = {
  text: "a",
  children: [
    { text: "p", children: null },
    { text: "c", children: null },
  ],
}

module.exports = {
  testNodeOneAnd,
  testNodeOneAndContradiction,
  bigTest,
  throwsOnIncorrectX,
  throwsOnIncorrectFork,
  throwsOnNotInPending,
  throwsOnNotExhausted,
  throwsOnContradictionNotMarked,
  throwsOnForkWhenChain,
  throwsOnVarFork,
}
