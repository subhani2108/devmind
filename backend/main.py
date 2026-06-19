from fastapi import FastAPI,UploadFile,File
import shutil
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from pydantic import BaseModel
from langchain.tools import tool
from langgraph.prebuilt import create_react_agent
from fastapi.middleware.cors import CORSMiddleware




load_dotenv()

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

parser=StrOutputParser()

class ChatRequest(BaseModel):
    question:str

@app.get('/')
def health_check():
    return {"status":"DevMind API is running"}

@app.post('/upload')
async def uplaod_file(file:UploadFile=File(...)):
    #Step1: Save File

    os.makedirs("uploaded_files", exist_ok=True)
    save_path = f"uploaded_files/{file.filename}"

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    #Step2:Load PDF    

    loader=PyPDFLoader(save_path)
    documents=loader.load()

    #Step3: Split into Chunks
    text_splitter=RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks=text_splitter.split_documents(documents)

    #Step4: Converting chunks into Embeddings and storing in vectorstores

    vectorstore=Chroma.from_documents(
        documents=chunks,
        embedding=OpenAIEmbeddings(),
        persist_directory="chroma_db"
    )

    # Step5: Return
    return {"message":"file uploaded and stored succesfully", "path":save_path,"chunk_size":len(chunks)}

@app.post('/chat')
async def chat(request : ChatRequest):
    question=request.question

    # Step1 : Load ChromaDB

    vectorstore=Chroma(
        persist_directory="chroma_db",
        embedding_function=OpenAIEmbeddings()
    )

    # Step2 : Create Retriever

    retriever=vectorstore.as_retriever()

    # Step3 : Create Prompt

    prompt=ChatPromptTemplate.from_template(
        """
        Answer the question based on the context below.
        Context:{context}
        Question:{question}
        """
    )

    # Step4 : Building Chain

    llm=ChatOpenAI(model="gpt-4o-mini")

    chain=({"context":retriever , "question":RunnablePassthrough()}
           | prompt | llm | parser)

    # Step5 : Run and Return Answer

    answer=chain.invoke(question)

    return {"answer":answer}

@tool
def search_docs(question:str)->str:
    """Search the uploaded documents to answer the questions"""
    vectorstore=Chroma(
        persist_directory="chroma_db",
        embedding_function=OpenAIEmbeddings()
    )
    retriever=vectorstore.as_retriever()
    docs=retriever.invoke(question)
    return "\n".join([doc.page_content for doc in docs])

@tool
def generate_code(request:str)->str:
    """Generate code based on user's request."""

    llm=ChatOpenAI(model="gpt-4o-mini")
    return llm.invoke(request).content

@app.post('/agent')
async def agent_chat(request:ChatRequest):
    question=request.question

    tools=[search_docs,generate_code]
    llm=ChatOpenAI(model='gpt-4o-mini')

    agent=create_react_agent(
        model=llm,
        tools=tools
    )

    result=agent.invoke({
        "messages":[{"role":"user","content":question}]
    })
    answer=result["messages"][-1].content

    return {"answer":answer}