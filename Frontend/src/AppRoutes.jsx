import React from "react";
import { Route, Routes } from "react-router-dom";

import GlobalDashboard from "./pages/GlobalDashboard";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PersonalDashboard from "./pages/PersonalDashboard";
import DashboardLeftNav from "./components/DashboardLeftNav";
import ProtectedRoute from "./components/ProtectedRoute";

import DeleteWorkspace from "./pages/DeleteWorkspace";
import Workspace from "./pages/Workspace";
import AllDepartments from "./pages/AllDepartments";
import Department from "./pages/Department";
import ActivityPage from "./pages/ActivityPage";
import DeleteDepartment from "./pages/DeleteDepartment";
import NotificationsPage from "./pages/NotificationPage";

import { WorkspaceProvider } from "./context/WorkspaceContext";
import ChatPage from "./pages/ChatPage";
import MyTasksPage from "./pages/MyTasksPage";
import TaskDetailsPage from "./pages/TaskDetailPage";
import TaskPage from "./pages/TaskPage";
import ExplorePage from "./pages/ExplorePage";
import BillingPage from "./pages/BillingPage";
import PricingPage from "./pages/PricingPage";
import VideoCall from "./pages/VideoCall";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<GlobalDashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pricing" element={<PricingPage />} />

      {/* 🔥 VIDEO CALL (IMPORTANT - OUTSIDE DASHBOARD) */}
      <Route
        path="/video/:roomId"
        element={
          <ProtectedRoute>
            <VideoCall />
          </ProtectedRoute>
        }
      />

      {/* ================= PROTECTED ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <WorkspaceProvider>
              <DashboardLeftNav />
            </WorkspaceProvider>
          </ProtectedRoute>
        }
      >
        {/* DEFAULT */}
        <Route index element={<PersonalDashboard />} />

        {/* WORKSPACE */}
        <Route path="delete-workspace" element={<DeleteWorkspace />} />
        <Route path="workspace/:workspaceId" element={<Workspace />} />

        {/* DEPARTMENTS */}
        <Route
          path="workspace/:workspaceId/departments"
          element={<AllDepartments />}
        />

        <Route
          path="workspace/:workspaceId/department/:departmentId"
          element={<Department />}
        />

        {/* TASKS */}
        <Route
          path="workspace/:workspaceId/department/:departmentId/tasks"
          element={<TaskPage />}
        />

        <Route
          path="workspace/:workspaceId/department/:departmentId/tasks/task/:taskId"
          element={<TaskDetailsPage />}
        />

        <Route
          path="workspace/:workspaceId/department/:departmentId/my-tasks"
          element={<MyTasksPage />}
        />

        {/* ACTIVITY */}
        <Route
          path="workspace/:workspaceId/activity"
          element={<ActivityPage />}
        />

        <Route
          path="workspace/:workspaceId/department/:departmentId/activity"
          element={<ActivityPage />}
        />

        {/* DELETE DEPARTMENT */}
        <Route
          path="workspace/:workspaceId/delete-department"
          element={<DeleteDepartment />}
        />

        {/* NOTIFICATIONS */}
        <Route path="notifications" element={<NotificationsPage />} />

        {/* BILLING */}
        <Route path="billings" element={<BillingPage />} />

        {/* EXPLORE */}
        <Route path="explore" element={<ExplorePage />} />

        {/* CHAT */}
        <Route
          path="workspace/:workspaceId/department/:departmentId/chat/:chatRoomId"
          element={<ChatPage />}
        />

        <Route
          path="workspace/:workspaceId/department/:departmentId/chat"
          element={<ChatPage />}
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;