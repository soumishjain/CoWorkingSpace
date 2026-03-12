import React from 'react'
import LoginForm from '../components/LoginForm'
import { useLoginState } from '../state/useLoginState'
import { useLogin } from '../hooks/useLogin'

const Login = () => {

  const state = useLoginState()

  const {submitLogin} = useLogin(state)

  const handleChange = (e) => {
    const {name , value} = e.target

    state.setFormData(prev => ({
      ...prev , 
      [name] : value
    }))

  }

  const handleSubmit = (e) => {
    e.preventDefault()

    submitLogin()
  }

  return (
    <>
    <LoginForm 
    formData={state.formData}
    onChange={handleChange}
    onSubmit={handleSubmit}
    loading={state.loading}
    error={state.error}
    />
    </>
  )
}

export default Login
