import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import { FaClipboard, FaInfoCircle, FaEye } from 'react-icons/fa'; // Import icons for better design
import { Tooltip } from 'react-tippy'; // Import Tooltip component
import 'react-tippy/dist/tippy.css'; // Import default styles for Tooltip
Modal.setAppElement('#root');

const UrlCard = ({ urlData, baseUrl, newUrl }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const handleCopy = (shortUrl) => {
        navigator.clipboard.writeText(shortUrl);
        toast.success(`Copied ${shortUrl}`);
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <Tooltip title={`Redirects to: ${urlData.redirect}`} position="top" trigger="mouseenter">
            <div className="relative p-4 bg-gray-50 dark:bg-gray-900 text-center dark:text-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105">
                {urlData._id === newUrl?._id && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">New</span>
                )}
                <p className=" text-blue-600 hover:underline dark:text-blue-400 font-semibold mb-4">
                    <Link to={`/${urlData.shortId}`} className='break-all' target="_blank" rel="noopener noreferrer">{baseUrl + urlData.shortId}</Link>
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">
                    <FaEye className="inline-block mr-1" /> Views: {urlData.visits.length}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                    <button
                        className="flex items-center py-1 px-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                        onClick={() => handleCopy(`${baseUrl}${urlData.shortId}`)}
                    >
                        <FaClipboard className="mr-1" /> Copy
                    </button>
                    <button
                        className="flex items-center py-1 px-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
                        onClick={openModal}
                    >
                        <FaInfoCircle className="mr-1" /> Details
                    </button>
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="URL Details"
                    className="bg-white dark:text-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-xl mx-auto mt-20 transition-all duration-300"
                    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                >
                    {urlData && (
                        <>
                            <h2 className="text-gray-900 dark:text-white font-bold text-2xl mb-4">URL Details</h2>
                            <p><strong>Short URL:</strong> <Link to={`/${urlData.shortId}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">{baseUrl + urlData.shortId}</Link></p>
                            <p className='break-all'><strong>Original URL:</strong> {urlData.redirect}</p>
                            <p><strong>Views:</strong> {urlData.visits.length}</p>
                            <p><strong>Created At:</strong> {new Date(urlData.createdAt).toLocaleString()}</p>
                            <button
                                className="mt-4 py-2 px-4 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </>
                    )}
                </Modal>
            </div>
        </Tooltip>
    );
};

export default UrlCard;
