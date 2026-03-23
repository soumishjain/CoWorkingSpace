import React from 'react'
import { Route, Routes } from 'react-router-dom'

import GlobalDashboard from './pages/GlobalDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import PersonalDashboard from './pages/PersonalDashboard'
import DashboardLeftNav from './components/DashboardLeftNav'
import ProtectedRoute from './components/ProtectedRoute'

import DeleteWorkspace from './pages/DeleteWorkspace'
import Workspace from './pages/Workspace'
import AllDepartments from './pages/AllDepartments'
import Department from './pages/Department'
import ActivityPage from './pages/ActivityPage'
import DeleteDepartment from './pages/DeleteDepartment'
import NotificationsPage from './pages/NotificationPage'

import { WorkspaceProvider } from './context/WorkspaceContext'

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path='/' element={<GlobalDashboard />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />

      {/* PROTECTED */}
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

        {/* 🔵 GLOBAL */}
        <Route index element={<PersonalDashboard />} />
        <Route path='delete-workspace' element={<DeleteWorkspace />} />

        {/* 🔔 USER NOTIFICATIONS */}
        <Route path='notifications' element={<NotificationsPage />} />

        {/* 🟡 WORKSPACE */}
        <Route path='workspace/:workspaceId' element={<Workspace />} />

        {/* 🔥 ALL DEPARTMENTS */}
        <Route
          path='workspace/:workspaceId/departments'
          element={<AllDepartments />}
        />

        {/* 🔴 DEPARTMENT */}
        <Route
          path='workspace/:workspaceId/department/:departmentId'
          element={<Department />}
        />

        {/* 📊 ACTIVITY */}
        <Route
          path='workspace/:workspaceId/activity'
          element={<ActivityPage />}
        />

        <Route
          path='workspace/:workspaceId/department/:departmentId/activity'
          element={<ActivityPage />}
        />

        {/* ❌ DELETE DEPARTMENT */}
        <Route
          path='workspace/:workspaceId/delete-department'
          element={<DeleteDepartment />}
        />

      </Route>

    </Routes>
  )
}

export default AppRoutes