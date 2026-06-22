import os
import math
from typing import Any

try:
    import faiss
except Exception:  # pragma: no cover
    faiss = None

try:
    from sentence_transformers import SentenceTransformer
except Exception:  # pragma: no cover
    SentenceTransformer = None


DOCUMENTS = [
    {"type": "internship", "title": "AI Intern Starter Track", "text": "Beginner AI internship for Python, data, and ML fundamentals."},
    {"type": "hackathon", "title": "MERN Stack Sprint", "text": "Hackathon for MongoDB, Express, React, Node, APIs, and deployment."},
    {"type": "roadmap", "title": "Full Stack Developer Path", "text": "Learn React, Node.js, databases, authentication, testing, and deployment."},
    {"type": "internship", "title": "Frontend Engineering Internship", "text": "React internship focused on components, accessibility, and API integration."},
    {"type": "hackathon", "title": "Campus AI Buildathon", "text": "Build AI agents, RAG apps, semantic search, and productivity copilots."},
    {"type": "resource", "title": "Data Scientist Launch Plan", "text": "Statistics, Python, pandas, machine learning, SQL, and portfolio projects."},
    {"type": "resource", "title": "DevOps Fundamentals", "text": "Linux, Docker, CI/CD, cloud deployment, monitoring, and Kubernetes basics."},
]


class SemanticSearch:
    def __init__(self) -> None:
        self.model_name = os.getenv("EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
        self.model = None
        if SentenceTransformer:
            try:
                self.model = SentenceTransformer(self.model_name)
            except Exception:
                self.model = None
        self.documents = DOCUMENTS
        self.embeddings = self._embed([doc["text"] for doc in self.documents])
        self.index = None
        if faiss and self.model and self.embeddings:
            import numpy as np

            self.embeddings = np.array(self.embeddings).astype("float32")
            self.index = faiss.IndexFlatIP(self.embeddings.shape[1])
            self.index.add(self.embeddings)

    def _embed(self, texts: list[str]) -> list[list[float]]:
        if self.model:
            vectors = self.model.encode(texts, normalize_embeddings=True)
            return [list(vector) for vector in vectors]
        return [self._hash_embed(text) for text in texts]

    def _hash_embed(self, text: str) -> list[float]:
        words = text.lower().split()
        vector = [0.0] * 128
        for word in words:
            vector[hash(word) % 128] += 1.0
        norm = math.sqrt(sum(value * value for value in vector)) or 1.0
        return [value / norm for value in vector]

    def search(self, query: str, top_k: int = 8, user: Any | None = None) -> dict[str, Any]:
        enriched_query = query
        if user:
            skills = user.get("skills", []) if isinstance(user, dict) else []
            goal = user.get("careerGoal", "") if isinstance(user, dict) else ""
            enriched_query = f"{query} {' '.join(skills)} {goal}"

        q = self._embed([enriched_query])
        if self.index:
            scores, ids = self.index.search(q, min(top_k, len(self.documents)))
            matches = [
                {**self.documents[int(idx)], "score": float(scores[0][rank])}
                for rank, idx in enumerate(ids[0])
            ]
        else:
            scores = [sum(a * b for a, b in zip(vector, q[0])) for vector in self.embeddings]
            ids = sorted(range(len(scores)), key=lambda index: scores[index], reverse=True)[:top_k]
            matches = [{**self.documents[index], "score": float(scores[index])} for index in ids]

        return {"query": query, "results": matches}
