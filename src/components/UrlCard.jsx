import React, { useState } from 'react';
import { Link} from 'react-router-dom';
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


    return (
        <Tooltip title={`Redirects to: ${urlData.redirect}`} position="top" trigger="mouseenter">
            <div className="relative p-4 bg-gray-50 dark:bg-gray-900 text-center dark:text-white rounded-lg shadow-md hover:shadow-lg transform transition-all duration-300 hover:bg-gray-800 focus:outline-none hover:ring-2 hover:ring-offset-2 hover:ring-gray-500 hover:scale-105">
                {urlData._id === newUrl?._id && (
                    <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">New</span>
                )}
                <p className=" text-blue-600 hover:underline dark:text-blue-300 font-bold mb-4">
                    <Link to={`/${urlData.shortId}`} className='break-all' target="_blank" rel="noopener noreferrer">{baseUrl + urlData.shortId}</Link>
                </p>
                <p className="mt-2 text-gray-700 dark:text-gray-300 font-bold">
                    <FaEye className="inline-block mr-1" /> Views: {urlData.visits.length}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                    <button
                        className="flex items-center py-1 px-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                        onClick={() => handleCopy(`${baseUrl}${urlData.shortId}`)}
                    >
                        <FaClipboard className="mr-1" /> Copy
                    </button>
                    <Link to={`/url/${urlData.shortId}`}>
                    <button
                        className="flex items-center py-1 px-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
                    >
                        <FaInfoCircle className="mr-1" /> Details
                    </button>
                    </Link>
                </div>
            </div>
        </Tooltip>
    );
};

export default UrlCard;
