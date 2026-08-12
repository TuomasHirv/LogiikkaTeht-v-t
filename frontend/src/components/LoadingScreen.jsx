const Spinner = () => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-gray-600 animate-spin"
    />
  )
}

const LoadingError = () => {
  return (
    <div role="alert" className="flex flex-col items-center gap-4">
      <span className="text-red-600 text-6xl" aria-label="Loading Failed">
        ✕
      </span>
      <p className="text-lg text-red-600">Failed to load content.</p>
    </div>
  )
}

const LoadingScreen = ({ failed = false }) => {
  if (failed) {
    return <LoadingError />
  }
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg border border-gray-200 min-h-[90vh] max-h-[90vh] overflow-y-auto flex items-center justify-center">
      <Spinner />
    </div>
  )
}

export default LoadingScreen
export { Spinner, LoadingError }
