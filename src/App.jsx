import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate ,Outlet} from 'react-router-dom';
import Cookie from 'universal-cookie';
import axios from 'axios';
import { addUser } from './store/userSlice';
import Navbar from './components/Navbar';

function App() {
  const user = useSelector(state => state.userData);
  const navigate = useNavigate();
  useEffect(() => {
      const cookie = new Cookie();
      const token = cookie.get('token');
      if (!token) {
        navigate('/login');
        return;
      }
    
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
