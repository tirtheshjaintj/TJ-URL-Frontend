import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const UrlCard = ({ urlData, baseUrl }) => {
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
        <div className="p-4 bg-gray-100  dark:bg-gray-900 text-center dark:text-white rounded-lg shadow-md">
            <p className="text-blue-500 hover:underline">
                <Link to={`/${urlData.shortId}`} className='break-all dark:text-white' target="_blank" rel="noopener noreferrer">{location.href+urlData.shortId}</Link>
            </p>
            <p>Views: {urlData.visits.length}</p>
            <button
                className="m-2 py-1 px-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => handleCopy(`${baseUrl}${urlData.shortId}`)}
            >
                Copy
            </button>
            <button
                className="m-2 py-1 px-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={openModal}
            >
                Details
            </button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="URL Details"
                className="bg-white dark:text-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-xl mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                {urlData && (
                    <>
                        <h2 className="text-gray-900 dark:text-white font-bold text-2xl mb-4">URL Details</h2>
                        <p><strong>Short URL:</strong> <Link to={`/${urlData.shortId}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline dark:text-white">{location.href+urlData.shortId}</Link></p>
                        <p className='break-all'><strong>Original URL:</strong> {urlData.redirect}</p>
                        <p><strong>Views:</strong> {urlData.visits.length}</p>
                        <p><strong>Created At:</strong> {new Date(urlData.createdAt).toLocaleString()}</p>
                        <button
                            className="mt-4 py-2 px-4 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default UrlCard;
