import React from 'react'
import { Route, Routes } from 'react-router-dom'
import GlobalDashboard from './pages/GlobalDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import PersonalDashboard from './pages/PersonalDashboard'
import VerifyEmail from './components/VerifyEmail'
import DashboardLeftNav from './components/DashboardLeftNav'
import ProtectedRoute from './components/ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<GlobalDashboard />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardLeftNav />
    </ProtectedRoute>
  }
>
  <Route index element={<PersonalDashboard />} />
</Route>
    </Routes>
  )
}

export default AppRoutes
