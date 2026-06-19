import {createSlice} from '@reduxjs/toolkit'

const initialState={
    messages:[],
    isLoading:false,
    mode:'chat',
    uploadedFile:null
}

const chatSlice=createSlice({
    name:'chat',
    initialState,
    reducers:{
        addMessage: (state,action)=>{
            // push action.payload into state.messages
            state.messages.push(action.payload)
        },
        setLoading: (state,action)=>{
            // set state.isLoading to action.paylaod
            state.isLoading=action.payload
        },
        setMode: (state,action)=>{
            // set state.mode to action.paylaod
            state.mode=action.payload
        },
        setUploadedFile: (state,action)=>{
            // set state.uploadedFile to action.payload
            state.uploadedFile=action.payload
        }

    }
})


export const {addMessage,setLoading,setMode,setUploadedFile}=chatSlice.actions
export default chatSlice.reducer