import { useState } from "react"
import { useDispatch } from "react-redux"
import { setLoading, setUploadedFile } from "../store/chatSlice"
import axios from 'axios'

const FileUpload = () => {
  const dispatch=useDispatch()
  const [status,setStatus]=useState('')

  const handleUplaod=async (e)=>{
    const file=e.target.files[0]
    // console.log(file)
    if (!file) return

    // Create FormData to send file
    const formData=new FormData()
    formData.append('file', file)

    try{
      dispatch(setLoading(true))
      setStatus('Uploading...')

      const response=await axios.post(
        'http://localhost:8000/upload',
        formData
      )
      dispatch(setUploadedFile(file.name))
      setStatus(`✅ ${file.name} uploaded! ${response.data.chunk_size} chunks created`) 
    }
    catch (error){
      setStatus('❌ Upload failed. Try again.')
    }
    finally{
      dispatch(setLoading(false))
    }
  } 

  return (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
      <h2 className="text-sm font-medium text-gray-400 mb-2">📄 Upload Document</h2>
      <input type="file" accept=".pdf" onChange={handleUplaod} className="text-sm text-gray-400"/>
      {status && (<p className="mt-2 text-sm text-green-400">{status}</p>)}
    </div>
  )
}

export default FileUpload
