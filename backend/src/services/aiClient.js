import axios from 'axios';

const ai = axios.create({
  baseURL: (process.env.AI_SERVICE_URL || 'http://localhost:8000').replace(/\/$/, ''),
  timeout: 120000
});

async function postWithFallback(path, payload, fallback) {
  try {
    const { data } = await ai.post(path, payload);
    return data;
  } catch (error) {
    const status = error.response?.status;
    console.warn(`AI service unavailable for ${path}${status ? ` (${status})` : ''}. Using fallback.`);
    return typeof fallback === 'function' ? fallback(payload) : fallback;
  }
}

export async function orchestrate(payload) {
  return postWithFallback('/agents/orchestrate', payload, fallbackOrchestration);
}

export async function analyzeResume(payload) {
  return postWithFallback('/resume/analyze', payload, fallbackResumeAnalysis);
}

export async function generateStudyPlan(payload) {
  return postWithFallback('/study/generate', payload, fallbackStudyPlan);
}

export async function generateRoadmap(payload) {
  return postWithFallback('/career/roadmap', payload, fallbackRoadmap);
}

export async function searchOpportunities(payload) {
  return postWithFallback('/search', payload, fallbackSearch);
}

export async function chat(payload) {
  return postWithFallback('/copilot/chat', payload, fallbackChat);
}

export async function prioritizeTasks(payload) {
  return postWithFallback('/deadline/prioritize', payload, fallbackPriorities);
}

function fallbackStudyPlan(payload) {
  const subjects = payload.subjects?.length ? payload.subjects : ['Data Structures', 'DBMS', 'Web Development'];
  const hours = Math.max(1, Math.round((payload.hoursPerWeek || 8) / Math.min(subjects.length, 6)));
  return {
    agent: 'Study Agent',
    weeklyHours: payload.hoursPerWeek || 8,
    schedule: subjects.slice(0, 6).map((subject, index) => ({
      day: `Day ${index + 1}`,
      focus: subject,
      hours,
      tasks: [
        `Revise key concepts in ${subject}`,
        `Practice problems or build one small example for ${subject}`,
        'Summarize what you learned and list blockers'
      ]
    })),
    resources: subjects.slice(0, 4).map((subject) => `Use notes, YouTube, and practice sets for ${subject}`),
    adaptiveRule: 'Spend extra review time on any topic where confidence is below 3/5.'
  };
}

function fallbackRoadmap(payload) {
  const goal = payload.goal || 'Full Stack Developer';
  return {
    agent: 'Career Agent',
    goal,
    missingSkills: ['Testing', 'Deployment', 'Portfolio polish'],
    milestones: [
      { phase: 'Foundation', skills: ['HTML/CSS', 'JavaScript'], project: `Build a clean ${goal} starter project` },
      { phase: 'Applied', skills: ['React', 'Node.js', 'MongoDB'], project: 'Create a full-stack app with authentication' },
      { phase: 'Career-ready', skills: ['Testing', 'Deployment', 'GitHub README'], project: 'Deploy and document a portfolio case study' }
    ],
    opportunityStrategy: `Apply weekly to ${goal} internships and hackathons.`
  };
}

function fallbackSearch(payload) {
  const query = payload.query || 'student opportunities';
  return {
    query,
    results: [
      { type: 'internship', title: 'AI Intern Starter Track', text: 'Beginner-friendly AI internship path for Python, data, and ML basics.', score: 0.91 },
      { type: 'hackathon', title: 'MERN Stack Sprint', text: 'Hackathon idea focused on MongoDB, Express, React, Node, and deployment.', score: 0.86 },
      { type: 'roadmap', title: 'Full Stack Developer Path', text: 'Learn React, Node.js, databases, auth, testing, and deployment.', score: 0.82 }
    ]
  };
}

function fallbackChat(payload) {
  return {
    answer: `Here is a practical next step: break "${payload.message}" into one study task, one project task, and one deadline task. Focus on the task with the closest due date first, then spend 45 minutes on your career skill practice.`,
    agentsConsulted: ['Study Agent', 'Career Agent', 'Resume Agent', 'Deadline Agent'],
    suggestedActions: ['Add one task with a deadline', 'Generate a study plan', 'Search for one matching opportunity']
  };
}

function fallbackResumeAnalysis(payload) {
  const text = payload.text?.toLowerCase() || '';
  const skills = ['react', 'node', 'mongodb', 'python', 'api', 'git'];
  const present = skills.filter((skill) => text.includes(skill));
  return {
    agent: 'Resume Agent',
    score: 55 + present.length * 6,
    strengths: present.map((skill) => skill.toUpperCase()),
    missingSkills: skills.filter((skill) => !present.includes(skill)).map((skill) => skill.toUpperCase()),
    suggestions: ['Add measurable project impact', 'Include deployed links', 'Group technical skills clearly'],
    projects: ['AI study planner', 'Semantic internship finder', 'Resume analyzer']
  };
}

function fallbackPriorities(payload) {
  return {
    agent: 'Deadline Agent',
    rankedTasks: payload.tasks || [],
    reminders: (payload.tasks || []).slice(0, 3).map((task) => `Start '${task.title}' today.`)
  };
}

function fallbackOrchestration(payload) {
  return {
    intent: payload.intent || 'daily brief',
    agents: ['Study Agent', 'Career Agent', 'Resume Agent', 'Deadline Agent'],
    recommendations: [fallbackStudyPlan({ subjects: ['Core CS'], hoursPerWeek: 8 }), fallbackRoadmap({ goal: payload.user?.careerGoal })],
    unifiedNextActions: ['Finish the nearest deadline first', 'Practice one missing skill today', 'Turn today’s learning into a portfolio commit']
  };
}
