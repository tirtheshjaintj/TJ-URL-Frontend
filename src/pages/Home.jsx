import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {useSelector } from 'react-redux';
import Cookie from 'universal-cookie';
import { url as root } from '../key';
import toast, { Toaster } from 'react-hot-toast';
import UrlCard from '../components/UrlCard';
import LoadSkeleton from '../components/LoadSkeleton';
import { FaSpinner } from 'react-icons/fa';
function Home() {
    const user = useSelector(state => state.userData);
    const cookie = new Cookie();
    const token = cookie.get('token');
    const [url, setUrl] = useState('');
    const [generatedUrls, setGeneratedUrls] = useState([]);
    const [newUrl, setNewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUrls, setFilteredUrls] = useState([]);
    const handleUrlChange = (e) => {
        const value = e.target.value;
        const trimmedValue = value.trim(); // Remove leading and trailing spaces
        if (value === "" || trimmedValue !== "") { // Allow clearing the search box and non-empty values
            setUrl(e.target.value);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        const trimmedValue = value.trim(); // Remove leading and trailing spaces
        if (value === "" || trimmedValue !== "") { // Allow clearing the search box and non-empty values
            setSearchQuery(value.toLowerCase());
        }
    };

    const filterUrls = (query) => {
        const filtered = generatedUrls.filter(url => url.redirect.toLowerCase().includes(query) || url.shortId.toLowerCase().includes(query));
        setFilteredUrls(filtered);
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
            setNewUrl(response.data);
            setGeneratedUrls([response.data, ...generatedUrls]);
            setUrl('');
            toast.success('URL generated Successfully and Copied');
            navigator.clipboard.writeText(window.location.origin+"/"+ response.data.shortId);
        } catch (error) {
            toast.error(error.response?.data?.error);
        } finally {
            setGenerating(false);
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
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.error);
        }
    };

    useEffect(() => {
        fetchGeneratedUrls();
        console.log("Hello");
    }, [user]);

 
    useEffect(() => {
        if (generatedUrls.length > 0) {
            filterUrls(searchQuery);
        }
    }, [generatedUrls,searchQuery]);

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
                    <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 pt-6 pb-6 max-w-screen  rounded-lg shadow-md">
                        <form onSubmit={handleSubmit} className="w-full max-w-4xl flex flex-col mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
                            <div className="relative">
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
                            <div className="flex items-center mb-4">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    placeholder="Search your Generated URLs here"
                                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            {isLoading ? (
                                <LoadSkeleton />
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredUrls.map((item, index) => (
                                        <UrlCard key={index} urlData={item} baseUrl={window.location.origin+"/"} newUrl={newUrl} />
                                    ))}
                                    
                                </div>
                            )}
                            {(filteredUrls.length === 0 && generatedUrls.length!=0) && (
    <p className="text-center text-gray-500 dark:text-gray-400 break-all">Sorry, no results for "{searchQuery}"</p>
)}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}

export default Home;
