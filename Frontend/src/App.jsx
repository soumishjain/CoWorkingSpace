import React from 'react'
import AppRoutes from './AppRoutes'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
   <>
   <Toaster position='top-right'/>
   <AppRoutes />
   </>
  )
}

export default App
