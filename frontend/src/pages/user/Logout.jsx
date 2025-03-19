import React, { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const navigate = useNavigate()
  const {logout} = useContext(UserContext)
  logout()
  navigate('/login')

}

export default Logout