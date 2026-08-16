import React from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={Home} />
          <Route path='/register' element={Register} />
          <Route path='/login' element={Login} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App