from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .agents import AgentOrchestrator, CareerAgent, DeadlineAgent, ResumeAgent, StudyAgent
from .llm import LlmClient
from .schemas import (
    ChatRequest,
    OrchestrateRequest,
    PrioritizeRequest,
    ResumeAnalyzeRequest,
    RoadmapRequest,
    SearchRequest,
    StudyPlanRequest,
)
from .search import SemanticSearch

load_dotenv()

app = FastAPI(title="CampusCopilot AI Service", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

study_agent = StudyAgent()
career_agent = CareerAgent()
resume_agent = ResumeAgent()
deadline_agent = DeadlineAgent()
orchestrator = AgentOrchestrator()
semantic_search = SemanticSearch()
llm = LlmClient()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "ai-service"}


@app.post("/search")
def search(payload: SearchRequest):
    user = payload.user if isinstance(payload.user, dict) else {}
    return semantic_search.search(payload.query, payload.topK, user)


@app.post("/resume/analyze")
def analyze_resume(payload: ResumeAnalyzeRequest):
    user = payload.user if isinstance(payload.user, dict) else {}
    return resume_agent.analyze(payload.text, user)


@app.post("/study/generate")
def generate_study(payload: StudyPlanRequest):
    return study_agent.plan(payload.subjects, payload.hoursPerWeek, payload.examDate)


@app.post("/career/roadmap")
def career_roadmap(payload: RoadmapRequest):
    return career_agent.roadmap(payload.goal, payload.currentSkills, payload.interests)


@app.post("/deadline/prioritize")
def prioritize(payload: PrioritizeRequest):
    return deadline_agent.prioritize(payload.tasks)


@app.post("/agents/orchestrate")
def orchestrate(payload: OrchestrateRequest):
    return orchestrator.daily_brief(payload.user, payload.tasks, payload.intent)


@app.post("/copilot/chat")
async def copilot_chat(payload: ChatRequest):
    system = (
        "You are CampusCopilot AI, a student productivity copilot. "
        "Coordinate study, career, resume, and deadline agents. Give concise, actionable guidance."
    )
    response = await llm.complete(system, f"Message: {payload.message}\nContext: {payload.context}")
    return {
        "answer": response,
        "agentsConsulted": ["Study Agent", "Career Agent", "Resume Agent", "Deadline Agent"],
        "suggestedActions": [
            "Turn the advice into one task with a deadline.",
            "Ask for resources if a topic feels unclear.",
            "Review progress at the end of the day.",
        ],
    }
