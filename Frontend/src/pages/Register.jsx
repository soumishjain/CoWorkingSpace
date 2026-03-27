import { useState } from "react"
import RegisterForm from "../components/RegisterForm.jsx"
import { useRegister } from "../hooks/useRegister.js"
import { useRegisterState } from "../state/useRegistrationState.js"
import VerifyEmail from "../components/VerifyEmail.jsx"

const Register = () => {

 const state = useRegisterState()

 const {submitRegister} = useRegister(state)

 const handleChange = (e) => {

  const {name,value} = e.target

  state.setFormData(prev => ({
   ...prev,
   [name]:value
  }))

 }

 const handleFileChange = (e) => {

  state.setFormData(prev => ({
   ...prev,
   profileImage:e.target.files[0]
  }))

 }

 const handleSubmit = (e) => {
  e.preventDefault()
  submitRegister()
 }

 return (
  <>

  <RegisterForm
   formData={state.formData}
   onChange={handleChange}
   onFileChange={handleFileChange}
   onSubmit={handleSubmit}
   loading={state.loading}
   error={state.error}
  />
  </>

 )

}

export default Register