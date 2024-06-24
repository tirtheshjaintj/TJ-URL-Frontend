import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'universal-cookie';
import { FaCopy, FaEye, FaCalendarAlt, FaLink, FaInfoCircle, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactModal from 'react-modal';
import { Doughnut } from 'react-chartjs-2';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'tailwindcss/tailwind.css';
import { url } from '../key';
import toast, { Toaster } from 'react-hot-toast';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    defaults,
} from 'chart.js';

// Set the global default font color
defaults.color = "#fff";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

ReactModal.setAppElement('#root');

function Dashboard() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [urlData, setUrlData] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);
    const [error, setError] = useState(null);
    const cookie = new Cookie();
    const token = cookie.get('token');

    const fetchData = async () => {
        try {
            const response = await axios.get(`${url}/url/data/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUrlData(response.data.entry);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please try again later.');
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!urlData) {
            fetchData();
        }
    }, [urlData]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success('URL Copied ' + text);
    };

    const aggregateData = (field) => {
        return urlData.visits.reduce((acc, visit) => {
            acc[visit[field]] = (acc[visit[field]] || 0) + 1;
            return acc;
        }, {});
    };

  const createChartData = (field) => {
    const aggregatedData = aggregateData(field);
    return {
        labels: Object.keys(aggregatedData),
        datasets: [
            {
                label: `${field.charAt(0).toUpperCase() + field.slice(1)} Distribution`,
                data: Object.values(aggregatedData),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.8)',   // Dark red
                    'rgba(54, 162, 235, 0.8)',   // Dark blue
                    'rgba(255, 206, 86, 0.8)',   // Dark yellow
                    'rgba(75, 192, 192, 0.8)',   // Dark cyan
                    'rgba(153, 102, 255, 0.8)',  // Dark purple
                    'rgba(255, 159, 64, 0.8)',   // Dark orange
                    'rgba(255, 99, 132, 0.6)',   // Slightly lighter dark red
                    'rgba(54, 162, 235, 0.6)',   // Slightly lighter dark blue
                    'rgba(255, 206, 86, 0.6)',   // Slightly lighter dark yellow
                    'rgba(75, 192, 192, 0.6)',   // Slightly lighter dark cyan
                    'rgba(153, 102, 255, 0.6)',  // Slightly lighter dark purple
                    'rgba(255, 159, 64, 0.6)',   // Slightly lighter dark orange
                    'rgba(128, 128, 128, 0.8)',  // Dark gray
                    'rgba(100, 149, 237, 0.8)',  // Dark slate blue
                    'rgba(218, 165, 32, 0.8)',   // Dark goldenrod
                    'rgba(72, 209, 204, 0.8)',   // Dark cyan
                ],
            },
        ],
        options: {
            plugins: {
                legend: {
                    display: false, // Hide the legend
                },
                tooltip: {
                    bodyColor: 'white',
                    titleColor: 'white',
                    footerColor: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    borderWidth: 1,
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: 'white',
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)',
                    },
                },
                y: {
                    ticks: {
                        color: 'white',
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)',
                    },
                },
            },
            color: 'white',
            font: {
                size: 12,
            },
        },
    };
};

    
    

    const openModal = (visit) => {
        setSelectedVisit(visit);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedVisit(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-14 ml-3 mr-3">
            <Toaster />
            <div className="container mx-auto pt-10">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-gray-800 p-8 rounded-lg shadow-2xl">
                                <Skeleton count={5} />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center text-xl text-red-500">{error}</div>
                ) : (
                    urlData && (
                        <div>
                            <motion.div
                                className="bg-gray-800 p-8 rounded-lg shadow-2xl mb-8"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex justify-between items-center mb-6 ">
                                    <h1 className="text-4xl font-bold text-white">{urlData.shortId}</h1>
                                    <button
                                        className="text-gray-400 hover:text-white"
                                        onClick={() => copyToClipboard(window.location.origin + "/" + urlData.shortId)}
                                    >
                                        <FaCopy className="text-2xl" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <motion.div
                                        className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-xl font-semibold text-white flex items-center">
                                            <FaLink className="mr-2" /> Redirect
                                        </p>
                                        <p className="break-words text-gray-300">{urlData.redirect}</p>
                                    </motion.div>
                                    <motion.div
                                        className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-xl font-semibold text-white flex items-center">
                                            <FaEye className="mr-2" /> Views
                                        </p>
                                        <p className="text-3xl font-bold text-white items-center text-center">{urlData.visits.length}</p>
                                    </motion.div>
                                    <motion.div
                                        className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-xl font-semibold text-white flex items-center">
                                            <FaCalendarAlt className="mr-2" /> Created At
                                        </p>
                                        <p className="text-gray-300">{new Date(urlData.createdAt).toLocaleString()}</p>
                                    </motion.div>
                                    <motion.div
                                        className="bg-gray-700 p-6 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-xl font-semibold text-white flex items-center">
                                            <FaCalendarAlt className="mr-2" /> Last Visited At
                                        </p>
                                        <p className="text-gray-300">{new Date(urlData.updatedAt).toLocaleString()}</p>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg m-2">
                                    <h2 className="text-2xl font-semibold mb-4">Visits by OS</h2>
                                     <Doughnut 
                                    options={{ plugins: {
                                        legend: {
                                            display: false,
                                        }
                                    }}}
                                    
                                    
                                    data={createChartData('os')} 
                                    />
                                </div>

                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg m-2">
                                    <h2 className="text-2xl font-semibold mb-4">Visits by Browser</h2>
                                     <Doughnut 
                                    options={{ plugins: {
                                        legend: {
                                            display: false,
                                        }
                                    }}}data={createChartData('browser')} />
                                </div>

                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg m-2">
                                    <h2 className="text-2xl font-semibold mb-4">Visits by Country</h2>
                                     <Doughnut 
                                    options={{ plugins: {
                                        legend: {
                                            display: false,
                                        }
                                    }}}data={createChartData('country')} />
                                </div>

                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg m-2">
                                    <h2 className="text-2xl font-semibold mb-4">Visits by State</h2>
                                     <Doughnut 
                                    options={{ plugins: {
                                        legend: {
                                            display: false,
                                        }
                                    }}}data={createChartData('state')} />
                                </div>

                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg m-2">
                                    <h2 className="text-2xl font-semibold mb-4">Visits by City</h2>
                                     <Doughnut 
                                    options={{ plugins: {
                                        legend: {
                                            display: false,
                                        }
                                    }}}data={createChartData('city')} />
                                </div>

                                <div className="bg-gray-800 p-6 rounded-lg shadow-lg m-2">
                                    <h2 className="text-2xl font-semibold mb-4">Visits by Language</h2>
                                     <Doughnut 
                                    options={{ plugins: {
                                        legend: {
                                            display: false,
                                        }
                                    }}}data={createChartData('language')} />
                                </div>
                            
                            </div>
                            <div className='pb-16'>
                                <h2 className='p-3 text-3xl font-bold text-white flex items-center text-center'>Visit Logs<FaInfoCircle className="ml-2" /></h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {urlData.visits.slice(0).reverse().map((visit) => (
                                        <motion.div
                                            key={visit._id}
                                            className="bg-gray-800 p-6 rounded-lg shadow-lg m-2"
                                            onClick={() => openModal(visit)}
                                        >
                                            <p className="text-lg font-semibold mb-2 flex items-center">
                                                Visit Details <FaInfoCircle className="ml-2" />
                                            </p>
                                            <div className="space-y-2">
                                                <p><span className="font-semibold">IP:</span> {visit.ip}</p>
                                                <p><span className="font-semibold">Location:</span> {visit.city}, {visit.state}, {visit.country}</p>
                                                <p><span className="font-semibold">Visited At:</span> {new Date(visit?.timestamp).toLocaleString()}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            {selectedVisit && (
                                <ReactModal
                                    isOpen={modalIsOpen}
                                    onRequestClose={closeModal}
                                    contentLabel="Visit Details"
                                    className="bg-white ml-5 mr-5 dark:text-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-xl mx-auto mt-20 transition-all duration-300"
                                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                                >
                                    <h2 className="text-2xl font-semibold mb-4">Visit Details</h2>
                                    <button className="absolute top-0 right-0 p-4" onClick={closeModal}>
                                        <FaTimes className="text-2xl text-gray-500 hover:text-gray-300" />
                                    </button>
                                    <div className="space-y-4">
                                        <p><span className="font-semibold">OS:</span> {selectedVisit.os}</p>
                                        <p><span className="font-semibold">Browser:</span> {selectedVisit.browser}</p>
                                        <p><span className="font-semibold">IP:</span> {selectedVisit.ip}</p>
                                        <p><span className="font-semibold">Location:</span> {selectedVisit.city}, {selectedVisit.state}, {selectedVisit.country}</p>
                                        <p><span className="font-semibold">Provider:</span> {selectedVisit.provider}</p>
                                        <p><span className="font-semibold">Timezone:</span> {selectedVisit.timezone}</p>
                                        <p><span className="font-semibold">Coordinates:</span> {selectedVisit.coord}</p>
                                        <p><span className="font-semibold">Language:</span> {selectedVisit.language}</p>
                                    </div>
                                </ReactModal>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default Dashboard;
