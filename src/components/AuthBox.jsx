import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Cookie from 'universal-cookie';
import { addUser } from '../store/userSlice';
import { url as root } from '../key';
import axios from 'axios';
function AuthBox({children}) {
    const user = useSelector(state => state.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cookie = new Cookie();
    const token = cookie.get('token');
    const fetchData = async () => {
        if (!token) {
            navigate('/login');
            return;
        }
        const url = `${root}/auth`;
        try {
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.data || response.data.error) {
                cookie.remove('token');
                navigate('/login');
            } else {
                dispatch(addUser(response.data));
            }
        } catch (error) {
            toast.error(error.response?.data?.error);
            navigate('/login');
        } finally {
        }
    };
    useEffect(() => {
        if (!token) navigate('/login');
        if(!user){
        fetchData();
        }
    }, []);
return (
    <>
{children}
</>
)
}

export default AuthBox