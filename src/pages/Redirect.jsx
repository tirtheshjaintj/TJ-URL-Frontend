import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../key';

function Redirect() {
    const getBrowserInfo = () => {
        const ua =  window.navigator.userAgent;
        return ua.includes("Edg") ? "Microsoft Edge" :
               ua.includes("Chrome") ? "Google Chrome" :
               ua.includes("Safari") && !ua.includes("Chrome") ? "Apple Safari" :
               ua.includes("Firefox") ? "Mozilla Firefox" :
               ua.includes("Trident/") || ua.includes("MSIE") ? "Microsoft Internet Explorer" :
               ua.includes("Opera") || ua.includes("OPR") ? "Opera" : "Unknown";
    };
    
    // Get operating system information
    const getOsInfo = () => {
        const platform = window.navigator.platform;
        return platform.includes("Win") ? "Windows" :
               platform.includes("Mac") ? "MacOS" :
               platform.includes("Linux") ? "Linux" :
               platform.includes("iPhone") || platform.includes("iPad") ? "iOS" :
               platform.includes("Android") ? "Android" : "Unknown";
    };
    
    // Get user language
    const getUserLanguage = () => {
        return  window.navigator.language ||  window.navigator.userLanguage;
    };
    
    // Fetch user location data
    const fetchUserLocation = async () => {
        try {
            const { data } = await axios.get('https://ipinfo.io/json');
            console.log(data);
            return data;
        } catch (error) {
            return {};
        }
    };
    
    const { id } = useParams();
    const [msg, setMsg] = useState('Redirecting...');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const browser = getBrowserInfo();
            const os = getOsInfo();
            const language = getUserLanguage();
            try {
                const userLocation = fetchUserLocation();
                const userData = {
                    platform: os,
                    os: os,
                    browser: browser,
                    ip: userLocation.ip||"Unknown",
                    country: userLocation.country||"Unknown",
                    state: userLocation.region||"Unknown",
                    city: userLocation.city||"Unknown",
                    coord: userLocation.loc||"Unknown",
                    provider: userLocation.org||"Unknown",
                    postal: userLocation.postal,
                    timezone: userLocation.timezone||"Unknown",
                    language: language
                };
                const { data } = await axios.post(`${url}/url/${id}`, userData);
                window.location.href = data.redirect;
            } catch (error) {
                console.log(error);
                setMsg('Nothing Found');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [id]);
    

    return (
        <section className="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center min-h-screen pt-20">
            
                <button
                    disabled=""
                    type="button"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                >
                    <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                        />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                        />
                    </svg>
                    <h1 className={`text-4xl dark:text-white font-bold ${isLoading ? 'animate-grow' : ''}`}>Redirecting...</h1>
                </button>
        </section>
    );
}

export default Redirect;
