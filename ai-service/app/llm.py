import os


class LlmClient:
    def __init__(self) -> None:
        self.provider = os.getenv("LLM_PROVIDER", "mock").lower()

    async def complete(self, system: str, prompt: str) -> str:
        if self.provider == "openai" and os.getenv("OPENAI_API_KEY"):
            from openai import AsyncOpenAI

            client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = await client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[{"role": "system", "content": system}, {"role": "user", "content": prompt}],
                temperature=0.4,
            )
            return response.choices[0].message.content or ""

        if self.provider == "gemini" and os.getenv("GEMINI_API_KEY"):
            import google.generativeai as genai

            genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
            model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-1.5-flash"))
            response = await model.generate_content_async(f"{system}\n\n{prompt}")
            return response.text or ""

        return self._mock_response(prompt)

    def _mock_response(self, prompt: str) -> str:
        return (
            "Here is a practical plan: start with the highest-impact fundamentals, "
            "build one portfolio artifact per milestone, review progress weekly, and "
            "use deadlines to decide what deserves attention first. "
            f"Context received: {prompt[:260]}"
        )
