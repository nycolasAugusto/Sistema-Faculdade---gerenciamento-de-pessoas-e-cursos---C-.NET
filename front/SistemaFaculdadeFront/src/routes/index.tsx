import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Home } from '../pages/Home'
import { Login } from '../pages/Login'

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}