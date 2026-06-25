# 🧠 DevMind - AI Developer Knowledge Hub

A full-stack AI-powered application that lets you upload documents and chat with them using RAG (Retrieval Augmented Generation) and an intelligent LangGraph Agent.

## 🚀 Live Demo
[Add your demo video link here]

## ✨ Features

- 📄 **PDF Upload** — Upload any PDF document
- 💬 **RAG Chat Mode** — Ask questions grounded in your uploaded documents
- 🤖 **Agent Mode** — AI Agent autonomously decides between document search and code generation
- 🎯 **Source Grounded Answers** — Answers based on your actual documents, not hallucinations
- ⚡ **Real-time Chat UI** — Smooth chat experience with markdown rendering

## 🛠️ Tech Stack

### Backend
- **FastAPI** — REST API framework
- **LangChain** — LLM application framework
- **LangGraph** — AI Agent with ReAct pattern
- **ChromaDB** — Vector database for embeddings
- **OpenAI** — LLM and embeddings (gpt-4o-mini)

### Frontend
- **React 19** — UI framework
- **Redux Toolkit** — Global state management
- **React Query** — API mutations and caching
- **Tailwind CSS** — Styling
- **Axios** — HTTP client

## 🏗️ Architecture
User uploads PDF

↓

FastAPI receives file

↓

LangChain chunks + embeds text

↓

ChromaDB stores embeddings

↓

User asks question

↓

LangGraph Agent decides:

├── search_docs → ChromaDB RAG retrieval

└── generate_code → Direct LLM call

↓

Answer returned to React UI

## ⚙️ Setup Instructions

### Backend
```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file:

OPENAI_API_KEY=your_openai_api_key

Run the server:
```bash
python -m uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/upload` | Upload and process PDF |
| POST | `/chat` | RAG chat with documents |
| POST | `/agent` | LangGraph Agent chat |

## 🧠 GenAI Concepts Used

- **RAG** — Retrieval Augmented Generation
- **Embeddings** — OpenAI text-embedding-3-small
- **Vector Search** — Semantic similarity search with ChromaDB
- **LangChain LCEL** — Modern chain building with pipe operator
- **AI Agents** — LangGraph ReAct Agent with custom tools
- **Prompt Engineering** — Custom prompts for grounded answers

## 👨‍💻 Author
SK Subhani — [GitHub](https://github.com/subhani2108) | [LinkedIn](https://linkedin.com/in/shaik-subhani-415a38323)