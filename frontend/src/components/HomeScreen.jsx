import { useState } from "react"
import { topicSummary } from "../content/topicSummary"
const Word = ({ text }) => {
  return (
    <kbd className="w-full x-2 py-1 bg-slate-700 rounded font-mono shadow-sm border border-slate-600 text-black text-base hover:text-blue-400 transition-colors duration-300">
      {text}
    </kbd>
  )
}

const TopicButton = ({ text, topic, expandTopic }) => {
  return (
    <button onClick={() => expandTopic(topic)} className="h-full flex m-0.5">
      <Word text={text} />
    </button>
  )
}

const TopicGrid = ({ expandTopic }) => {
  return (
    <div className="rounded border-rounded border-2 bg-slate-800">
      <p className="text-slate-400">There are tasks for topics such as:</p>
      <div className="grid grid-cols-3">
        <TopicButton
          expandTopic={expandTopic}
          text={"Subformulas"}
          topic={"Subformula"}
        />
        <TopicButton
          expandTopic={expandTopic}
          text={"Truth-Tables"}
          topic={"Truth Table"}
        />
        <TopicButton
          expandTopic={expandTopic}
          text={"Equivalence Rules"}
          topic={"Equivalence Rules"}
        />
        <TopicButton
          expandTopic={expandTopic}
          text={"Semantic Trees"}
          topic={"Semantic Tree"}
        />
        <TopicButton
          expandTopic={expandTopic}
          text={"Normal Forms"}
          topic={"Normal Forms"}
        />
        <TopicButton
          expandTopic={expandTopic}
          text={"Resolution Method"}
          topic={"Resolution Method"}
        />
        <TopicButton
          expandTopic={expandTopic}
          text={"Natural Deduction"}
          topic={"Natural Deduction"}
        />
      </div>
      <p className="text-slate-400 text-sm">
        You can press on the topics to get a short summary!
      </p>
    </div>
  )
}

const HomeScreen = () => {
  const [summary, setSummary] = useState("")
  const [topic, setTopic] = useState("")

  const expandTopic = (topic) => {
    setSummary(topicSummary[topic])
    setTopic(topic)
  }
  const removeTopic = () => {
    setSummary("")
    setTopic("")
  }
  return (
    <div className="min-h-screen bg-slate-900 p-6 text-slate-100">
      <div className="mx-auto max-w-5xl flex flex-col items-center">
        <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400 mb-2">
          <h1>Propositional Logic Tasks</h1>
          <p className="text-sm font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
            created by: Tuomas Hirvonen
          </p>
          <p className="text-slate-400 text-sm md:text-base mb-6">
            This website and its tasks model the Helsinki University course:
            Introduction to Logic 1
          </p>
          <div className="rounded border-rounded border-2 bg-slate-800 mb-2">
            <p className="text-slate-400 md:text-base">
              To use the website simply log-in and pick a section from the top
              left.
            </p>
            <p className="text-slate-400 md:text-base">
              Each section and task gives its own instructions.
            </p>
          </div>
          {summary ? (
            <div className="rounded border-rounded border-2 bg-slate-800 w-full max-w-md">
              <div className="flex items-center gap-2 justify-between">
                <h1 className="text-sm font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
                  {topic}:
                </h1>
                <button
                  onClick={removeTopic}
                  className="text-red-400 text-xl px-2"
                >
                  x
                </button>
              </div>
              <p className="text-slate-400 text-sm ">{summary}</p>
              <p className="text-slate-400 text-sm mt-2">Press x to return.</p>
            </div>
          ) : (
            <TopicGrid expandTopic={expandTopic} />
          )}
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
