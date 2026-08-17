import useUserStore from "../../store"

const UserIndicator = ({ className }) => {
  const user = useUserStore((state) => state.user)
  const answers = useUserStore((state) => state.answers)
  const answerList = Object.values(answers)
  const amountCorrect = answerList.filter((a) => a.is_correct).length
  const amountIncorrect = answerList.length - amountCorrect
  if (!user) {
    return (
      <div className={className}>
        <p>Login to submit answers</p>
      </div>
    )
  }
  return (
    <div className={className}>
      <p className="text-green-500" role="passCount">
        {amountCorrect}✓
      </p>
      <p className="text-red-500" role="failCount">
        {amountIncorrect}✗
      </p>
      {user.username}
    </div>
  )
}

export default UserIndicator
