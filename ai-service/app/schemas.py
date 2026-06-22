from pydantic import BaseModel, Field
from typing import Any


class UserContext(BaseModel):
    skills: list[str] = []
    interests: list[str] = []
    careerGoal: str | None = None


class SearchRequest(BaseModel):
    query: str
    topK: int = Field(default=8, ge=1, le=20)
    user: UserContext | dict[str, Any] | None = None


class ResumeAnalyzeRequest(BaseModel):
    text: str
    user: UserContext | dict[str, Any] | None = None


class StudyPlanRequest(BaseModel):
    subjects: list[str] = []
    hoursPerWeek: int = Field(default=8, ge=1, le=80)
    examDate: str | None = None
    user: dict[str, Any] | None = None


class RoadmapRequest(BaseModel):
    goal: str
    currentSkills: list[str] = []
    interests: list[str] = []


class ChatRequest(BaseModel):
    message: str
    history: list[dict[str, str]] = []
    context: dict[str, Any] = {}


class PrioritizeRequest(BaseModel):
    tasks: list[dict[str, Any]] = []


class OrchestrateRequest(BaseModel):
    user: dict[str, Any] = {}
    tasks: list[dict[str, Any]] = []
    intent: str = "daily brief"
