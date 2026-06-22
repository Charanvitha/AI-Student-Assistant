export default {
  openapi: '3.0.0',
  info: {
    title: 'CampusCopilot AI API',
    version: '1.0.0',
    description: 'REST API for authentication, tasks, resumes, study planning, career roadmaps, opportunities, and copilot chat.'
  },
  servers: [{ url: 'http://localhost:5000' }],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  paths: {
    '/api/auth/register': { post: { security: [], summary: 'Register a student account' } },
    '/api/auth/login': { post: { security: [], summary: 'Login and receive JWT' } },
    '/api/resume/upload': { post: { summary: 'Upload a PDF resume' } },
    '/api/resume/analyze': { post: { summary: 'Analyze latest or selected resume' } },
    '/api/study/generate': { post: { summary: 'Generate an adaptive study plan' } },
    '/api/career/roadmap': { post: { summary: 'Generate a career roadmap' } },
    '/api/opportunities/search': { get: { summary: 'Semantic opportunity search' } },
    '/api/copilot/chat': { post: { summary: 'Chat with the AI copilot' } },
    '/api/tasks': {
      get: { summary: 'List tasks with AI prioritization' },
      post: { summary: 'Create a task' }
    },
    '/api/tasks/{id}': {
      put: { summary: 'Update a task' },
      delete: { summary: 'Delete a task' }
    }
  }
};
