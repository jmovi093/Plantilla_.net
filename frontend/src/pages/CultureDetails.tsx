import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Culture } from '../interfaces/Culture';
import { cultureService } from '../services/CultureService';
import { useObjectDetails } from '../hooks/useObjects';

const CultureDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { object: culture, loading, error } = useObjectDetails<Culture>(cultureService, id);

    if (loading) return <div className="flex items-center justify-center h-screen text-xl text-gray-600">Loading...</div>;
    if (error) return <div className="max-w-2xl p-4 mx-auto mt-10 text-center text-red-600 bg-red-100 rounded-lg">{error}</div>;
    if (!culture) return <div className="max-w-2xl p-4 mx-auto mt-10 text-center text-gray-600 bg-gray-100 rounded-lg">Culture not found</div>;

    return (
        <div className="container max-w-2xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Culture Details</h1>
            <div className="p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-6">
                    <h2 className="mb-2 text-xl font-semibold">Culture Information</h2>
                    <div className="grid grid-cols-1 gap-4 p-4 rounded-lg bg-gray-50 md:grid-cols-2">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Culture ID</p>
                            <p className="text-lg font-medium text-gray-800">{culture.cultureId}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Name</p>
                            <p className="text-lg font-medium text-gray-800">{culture.name}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Last Modified</p>
                            <p className="text-lg font-medium text-gray-800">{new Date(culture.modifiedDate).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-6">
                    <Link 
                        to={`/cultures/edit/${culture.cultureId}`}
                        className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Edit
                    </Link>
                    <Link 
                        to="/cultures"
                        className="px-6 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Back to List
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CultureDetails;