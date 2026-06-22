from datetime import datetime, timezone
from typing import Any


class StudyAgent:
    name = "Study Agent"

    def plan(self, subjects: list[str], hours_per_week: int, exam_date: str | None = None) -> dict[str, Any]:
        subjects = subjects or ["Data Structures", "Database Systems", "Web Development"]
        daily_hours = max(1, round(hours_per_week / 6, 1))
        schedule = [
            {
                "day": f"Day {index + 1}",
                "focus": subject,
                "tasks": [
                    f"Revise core concepts in {subject}",
                    f"Solve 3 practice problems or build a mini example for {subject}",
                    "Log blockers and ask the copilot for explanations",
                ],
                "hours": daily_hours,
            }
            for index, subject in enumerate(subjects[:6])
        ]
        return {
            "agent": self.name,
            "examDate": exam_date,
            "weeklyHours": hours_per_week,
            "schedule": schedule,
            "resources": self.resources(subjects),
            "adaptiveRule": "Increase review time by 30 minutes for topics with confidence below 3/5.",
        }

    def resources(self, subjects: list[str]) -> list[str]:
        return [f"Make a spaced-repetition deck for {subject}" for subject in subjects[:5]]


class CareerAgent:
    name = "Career Agent"

    def roadmap(self, goal: str, current_skills: list[str], interests: list[str]) -> dict[str, Any]:
        goal_map = {
            "Full Stack Developer": ["HTML/CSS", "React", "Node.js", "MongoDB", "Auth", "Deployment"],
            "Data Scientist": ["Python", "Statistics", "Pandas", "Machine Learning", "SQL", "MLOps"],
            "AI Engineer": ["Python", "PyTorch", "Embeddings", "RAG", "Evaluation", "Deployment"],
            "DevOps Engineer": ["Linux", "Docker", "CI/CD", "Kubernetes", "Cloud", "Monitoring"],
        }
        target = goal_map.get(goal, goal_map["Full Stack Developer"])
        missing = [skill for skill in target if skill.lower() not in {s.lower() for s in current_skills}]
        return {
            "agent": self.name,
            "goal": goal,
            "missingSkills": missing,
            "milestones": [
                {"phase": "Foundation", "skills": target[:2], "project": f"Build a basic {goal} portfolio piece"},
                {"phase": "Applied", "skills": target[2:4], "project": f"Ship a real-world {goal} case study"},
                {"phase": "Career-ready", "skills": target[4:], "project": "Deploy, document, and present your work"},
            ],
            "opportunityStrategy": f"Search weekly for {goal} internships, hackathons, and open-source tasks.",
            "interestsUsed": interests,
        }


class ResumeAgent:
    name = "Resume Agent"

    def analyze(self, text: str, user: dict[str, Any] | None = None) -> dict[str, Any]:
        text_lower = text.lower()
        desired = ["react", "node", "mongodb", "python", "api", "git", "docker", "testing", "ai", "sql"]
        present = [skill for skill in desired if skill in text_lower]
        missing = [skill.title() for skill in desired if skill not in text_lower]
        score = min(95, 45 + len(present) * 5)
        return {
            "agent": self.name,
            "score": score,
            "strengths": [skill.title() for skill in present] or ["Clear academic background"],
            "missingSkills": missing[:6],
            "suggestions": [
                "Add measurable project outcomes with numbers, users, latency, or accuracy.",
                "Include a skills section grouped by languages, frameworks, databases, and tools.",
                "Add one deployed project link and one GitHub repository link.",
            ],
            "projects": [
                "AI study planner with authentication and task prioritization",
                "Semantic internship finder using embeddings",
                "Resume analyzer with PDF parsing and skill gap reports",
            ],
            "careerGoal": (user or {}).get("careerGoal"),
        }


class DeadlineAgent:
    name = "Deadline Agent"

    def prioritize(self, tasks: list[dict[str, Any]]) -> dict[str, Any]:
        now = datetime.now(timezone.utc)

        def score(task: dict[str, Any]) -> int:
            deadline = str(task.get("deadline", ""))
            days = 30
            try:
                parsed = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
                days = max(0, (parsed - now).days)
            except Exception:
                pass
            status_penalty = 30 if task.get("status") == "done" else 0
            return max(0, 100 - days * 8 - status_penalty)

        ranked = sorted(
            [{**task, "aiScore": score(task), "reason": "Ranked by urgency, deadline proximity, and status."} for task in tasks],
            key=lambda item: item["aiScore"],
            reverse=True,
        )
        return {
            "agent": self.name,
            "rankedTasks": ranked,
            "reminders": [
                f"Start '{task.get('title')}' today." for task in ranked[:3] if task.get("status") != "done"
            ],
        }


class AgentOrchestrator:
    def __init__(self) -> None:
        self.study = StudyAgent()
        self.career = CareerAgent()
        self.resume = ResumeAgent()
        self.deadline = DeadlineAgent()

    def daily_brief(self, user: dict[str, Any], tasks: list[dict[str, Any]], intent: str) -> dict[str, Any]:
        skills = user.get("skills", [])
        interests = user.get("interests", [])
        goal = user.get("careerGoal", "Full Stack Developer")
        return {
            "intent": intent,
            "agents": [
                self.study.name,
                self.career.name,
                self.resume.name,
                self.deadline.name,
            ],
            "recommendations": [
                self.study.plan(interests[:3] or ["Core CS"], 8),
                self.career.roadmap(goal, skills, interests),
                self.deadline.prioritize(tasks),
            ],
            "unifiedNextActions": [
                "Finish the most urgent academic task first.",
                f"Spend 45 minutes on the next missing skill for {goal}.",
                "Convert today's learning into one portfolio commit.",
            ],
        }
