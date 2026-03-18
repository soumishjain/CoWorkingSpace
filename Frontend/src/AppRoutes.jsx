import React from 'react'
import { Route, Routes } from 'react-router-dom'
import GlobalDashboard from './pages/GlobalDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import PersonalDashboard from './pages/PersonalDashboard'
import VerifyEmail from './components/VerifyEmail'
import DashboardLeftNav from './components/DashboardLeftNav'
import ProtectedRoute from './components/ProtectedRoute'
import DeleteWorkspace from './pages/DeleteWorkspace'
import Workspace from './pages/Workspace'
import AllDepartments from './pages/AllDepartments' // 🔥 ADD
// (future pages)
import Department from './pages/Department' // optional bana lena
import ActivityPage from './pages/ActivityPage' // optional
import DeleteDepartment from './pages/DeleteDepartment'
import { WorkspaceProvider } from './context/WorkspaceContext'

const AppRoutes = () => {
  return (
    <Routes>

      <Route path='/' element={<GlobalDashboard />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />

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

        {/* 🟡 WORKSPACE */}
        <Route path='workspace/:workspaceId' element={<Workspace />} />

        {/* 🔥 ALL DEPARTMENTS PAGE */}
        <Route
          path='workspace/:workspaceId/departments'
          element={<AllDepartments />}
        />

        {/* 🔴 DEPARTMENT LEVEL */}
        <Route
          path='workspace/:workspaceId/department/:departmentId'
          element={<Department />}
        />

        {/* 🔥 OPTIONAL */}
        <Route
          path='workspace/:workspaceId/activity'
          element={<ActivityPage />}
        />

        <Route
          path='workspace/:workspaceId/delete-department'
          element={<DeleteDepartment />}
        />

      </Route>

    </Routes>
  )
}

export default AppRoutes