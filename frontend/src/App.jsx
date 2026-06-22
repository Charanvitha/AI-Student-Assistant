import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx';
import StudyPlanner from './pages/StudyPlanner.jsx';
import Opportunities from './pages/Opportunities.jsx';
import CareerRoadmap from './pages/CareerRoadmap.jsx';
import Tasks from './pages/Tasks.jsx';
import Copilot from './pages/Copilot.jsx';

export default function App({ guard: ProtectedRoute }) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="resume" element={<ResumeAnalyzer />} />
        <Route path="study" element={<StudyPlanner />} />
        <Route path="opportunities" element={<Opportunities />} />
        <Route path="roadmap" element={<CareerRoadmap />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="copilot" element={<Copilot />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
