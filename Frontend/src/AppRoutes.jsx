import React from 'react'
import { Route, Routes } from 'react-router-dom'
import GlobalDashboard from './pages/GlobalDashboard'
import Register from './pages/Register'
import Login from './pages/Login'
import PersonalDashboard from './pages/PersonalDashboard'
import VerifyEmail from './components/VerifyEmail'

const AppRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<GlobalDashboard />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/dashboard' element={<PersonalDashboard />}/>
    </Routes>
  )
}

export default AppRoutes
