import axios from 'axios';

const ai = axios.create({
  baseURL: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  timeout: 30000
});

export async function orchestrate(payload) {
  const { data } = await ai.post('/agents/orchestrate', payload);
  return data;
}

export async function analyzeResume(payload) {
  const { data } = await ai.post('/resume/analyze', payload);
  return data;
}

export async function generateStudyPlan(payload) {
  const { data } = await ai.post('/study/generate', payload);
  return data;
}

export async function generateRoadmap(payload) {
  const { data } = await ai.post('/career/roadmap', payload);
  return data;
}

export async function searchOpportunities(payload) {
  const { data } = await ai.post('/search', payload);
  return data;
}

export async function chat(payload) {
  const { data } = await ai.post('/copilot/chat', payload);
  return data;
}

export async function prioritizeTasks(payload) {
  const { data } = await ai.post('/deadline/prioritize', payload);
  return data;
}
