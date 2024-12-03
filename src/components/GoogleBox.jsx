import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Cookie from "universal-cookie";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../key';

function GoogleBox({ setIsLoading }) {
  const cookie = new Cookie();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      // console.log(decodedToken);
 
      const { name = "Anonymous", email, sub: google_id } = decodedToken; // Default name
      // console.log(`${url}/user/google_login`);
      const sanitized_name = name.replace(/[^a-zA-Z\s]/g, "").trim();
      setIsLoading(true); // Set loading state
      const response = await axios.post(`${url}/auth/google_login`, {
        email,
        name:sanitized_name,
        google_id,
      });

      if (response.data.status) {
        toast.success('Logged In Successfully');
        const token = response?.data?.token;
        if (token) {
          cookie.set("token", token, {
            path: '/',
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          });
          navigate('/');
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      const error_msg = error.response?.data?.message || "Google Login failed.";
      toast.error(error_msg);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Login failed");
  };

  return (
    <div className="flex justify-center items-center">
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={handleGoogleLoginError}
    />
    </div>
  );
}

export default GoogleBox;
