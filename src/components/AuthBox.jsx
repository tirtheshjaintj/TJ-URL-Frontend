import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import Cookie from 'universal-cookie';
import { addUser } from '../store/userSlice';
import { url as root } from '../key';
import axios from 'axios';
import toast from 'react-hot-toast';
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
        // console.log(token);
        const requrl = `${root}/auth`;
        try {
            const response = await axios.get(requrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // console.log(response);
            if (!response.data || response.data.error) {
                cookie.remove('token');
                navigate('/login');
            } else {
            dispatch(addUser(response.data));
            }
        } catch (error) {
            toast.error(error.response?.data?.error);
            navigate('/login');
        }
    };
    
    useEffect(() => {
        if (!token) navigate('/login');
        if(!user && token){
        fetchData();
        }
    }, [user]);

return (
    <>
{children}
</>
)
}

export default AuthBox