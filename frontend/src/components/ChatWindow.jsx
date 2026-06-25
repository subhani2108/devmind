import { useDispatch, useSelector } from "react-redux"
import { addMessage, setLoading } from "../store/chatSlice"
import { useEffect, useRef, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


const ChatWindow = () => {
  const dispatch = useDispatch()
  const messages = useSelector(state => state.chat.messages)
  const isLoading = useSelector(state => state.chat.isLoading)
  const mode = useSelector(state => state.chat.mode)
  const uploadedFile = useSelector(state => state.chat.uploadedFile)

  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  // Auto scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  },[messages])

  // React query Mutation for chat

  const mutation = useMutation({
    mutationFn: async (question) => {
      const endpoint = mode === 'agent' ?
        'https://devmind-backend-pd6p.onrender.com/agent' :
        'https://devmind-backend-pd6p.onrender.com/chat'
      const response = await axios.post(endpoint, { question })
      return response.data.answer
    },
    onSuccess: (answer) => {
      dispatch(addMessage({ role: 'assistant', content: answer }))
      dispatch(setLoading(false))
    },
    onError: () => {
      dispatch(addMessage({ role: 'assistant', content: '❌ Something went wrong. Try again.' }))
      dispatch(setLoading(false))
    }
  })

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message to store
    dispatch(addMessage({ role: 'user', content: input }))
    dispatch(setLoading(true))

    // Call API
    mutation.mutate(input)
    setInput('')
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="flex flex-col bg-gray-900 rounded-lg border border-gray-800 h-[500px]">
      {/* Mode Indicator */}
      <div className="p-3 border-b border-gray-800">
        <span className="text-xs text-gray-400">
          {mode === 'agent' ? '🤖 Agent Mode' : '💬 Chat Mode'}
          {uploadedFile && ` • 📄 ${uploadedFile}`}
        </span>
      </div>
      {/* Messages  */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (<p className="text-gray-600 text-sm text-center mt-8">Upload a PDF and start asking questions!</p>)}
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-800 text-gray-200 self-start'}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {
          isLoading && (<div className="bg-gray-800 text-gray-400 p-3 rounded-lg max-w-[80%] text-sm self-start">Thinking...</div>)
        }
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your document..."
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 text-sm outline-none" />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm"
        >send</button>
      </div>
    </div>
  )
}

export default ChatWindow
