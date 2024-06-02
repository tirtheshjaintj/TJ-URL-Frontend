import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Cookie from 'universal-cookie';
import { addUser } from '../store/userSlice';
import { url as root } from '../key';
import toast, { Toaster } from 'react-hot-toast';
import UrlCard from '../components/UrlCard';
import LoadSkeleton from '../components/LoadSkeleton';
import { FaSpinner } from 'react-icons/fa'; // Import the spinner icon

function Home() {
    const user = useSelector(state => state.userData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cookie = new Cookie();
    const token = cookie.get('token');
    const [url, setUrl] = useState('');
    const [generatedUrls, setGeneratedUrls] = useState([]);
    const [newUrl, setNewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const response = await axios.post(`${root}/url/create`, { url }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNewUrl(response.data); // Set the newly generated URL
            setGeneratedUrls([response.data, ...generatedUrls]);
            setUrl('');
            toast.success('URL generated Successfully and Copied');
            navigator.clipboard.writeText(window.location.href + response.data.shortId);
        } catch (error) {
            toast.error(error.response?.data?.error);
        } finally {
            setGenerating(false);
        }
    };

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
            setIsLoading(false);
        }
    };

    const fetchGeneratedUrls = async () => {
        try {
            const response = await axios.get(`${root}/url`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setGeneratedUrls(response.data.reverse());
        } catch (error) {
            toast.error(error.response?.data?.error);
        }
    };

    useEffect(() => {
        if (!token) navigate('/login');
        fetchData();
        fetchGeneratedUrls();
    }, []);

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-20">
            <Toaster position="bottom-right" />
            {token && (
                <>
                    <div className="flex items-center justify-center w-full flex-col text-center">
                        <>
                            <h2 className="text-white font-bold p-5 text-2xl">Welcome, {user?.name || "Master"}</h2>
                            <h2 className="text-white font-bold p-1 text-4xl">Let's Make it Short</h2>
                        </>
                    </div>
                    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                        <form onSubmit={handleSubmit} className="w-full flex flex-col max-w-4xl mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                            <div>
                                <input
                                    type="url"
                                    name="url"
                                    id="url"
                                    value={url}
                                    onChange={handleUrlChange}
                                    className="mt-1 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Enter URL to shorten"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-2.5 px-4 bg-gray-700 text-white font-medium rounded-lg focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
                                disabled={generating}
                            >
                                {generating ? (
                                    <>
                                        <FaSpinner className="mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Short URL"
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="flex items-center justify-center mt-6 pb-20">
                        <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-4">Generated URLs</h3>
                            {isLoading ? ( // Show loading indicator if data is still loading
                                <LoadSkeleton />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {generatedUrls.map((item, index) => (
                                        <UrlCard key={index} urlData={item} baseUrl={window.location.href} newUrl={newUrl} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

export default Home;
