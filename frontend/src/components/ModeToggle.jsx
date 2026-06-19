import React, { use } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setMode } from '../store/chatSlice'

const ModeToggle = () => {
  const mode = useSelector(state => state.chat.mode)
  const dispatch = useDispatch()

  return (
    <div className='flex gap-2'>
      <button onClick={()=>dispatch(setMode('chat'))} className={`px-4 py-2 rounded-lg font-medium transition-all ${mode === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>💬 Chat Mode</button>

      <button onClick={()=>dispatch(setMode('agent'))} className={`px-4 py-2 rounded-lg font-medium transition-all ${mode === 'agent' ? 'bg-blue-600 text-white':'bg-gray-800 text-gray-400'}`}>🤖 Agent Mode</button>
    </div>
  )
}

export default ModeToggle
