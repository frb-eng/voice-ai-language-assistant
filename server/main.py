from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from routers import learning_router, chat_router, speech_router

load_dotenv()

app = FastAPI(
    title="Voice AI Language Assistant",
    description="An interactive tool for German language learning",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(learning_router)
app.include_router(chat_router)
app.include_router(speech_router)
