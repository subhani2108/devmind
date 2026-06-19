import ChatWindow from "./components/ChatWindow"
import FileUpload from "./components/FileUpload"
import ModeToggle from "./components/ModeToggle"

function App() {

  return (
    <>
     <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="p-4 border-b bg-gray-800">
          <h1 className="text-2xl font-bold text-blue-400">🧠 DevMind</h1>
          <p className="text-gray-400 text-sm">AI Developer Knowledge Hub</p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto p-4 flex flex-col gap-4">
          <ModeToggle/>
          <FileUpload/>
          <ChatWindow/>
        </main>

     </div>
    </>
  )
}

export default App
