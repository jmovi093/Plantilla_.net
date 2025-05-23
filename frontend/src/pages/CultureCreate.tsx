import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Culture } from '../interfaces/Culture';
import { cultureService } from '../services/CultureService';
import { useObjectForm } from '../hooks/useObjects';
import Swal from 'sweetalert2';

const CultureCreate: React.FC = () => {
    const navigate = useNavigate();
    const { formData, handleInputChange, error, resetError } = useObjectForm<Culture>({
        cultureId: '',
        name: '',
        modifiedDate: new Date().toISOString()
    });
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetError();

        const result = await Swal.fire({
            title: 'Create culture?',
            text: `Do you want to create the culture ${formData.name}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, create',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                if (!formData.cultureId?.trim()) throw new Error('Culture ID is required');
                if (!formData.name?.trim()) throw new Error('Name is required');

                await cultureService.create(formData as Culture);
                Swal.fire('Created!', 'The culture has been successfully created.', 'success');
                navigate('/cultures');
            } catch (err) {
                Swal.fire('Error', (err as Error).message || 'Error creating the culture.', 'error');
                console.error('Error creating culture:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container max-w-2xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Create New Culture</h1>
            {error && <div className="p-4 mb-6 text-white bg-red-600 rounded-lg shadow">{error}</div>}

            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="cultureId">Culture ID</label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="cultureId"
                        type="text"
                        placeholder="Culture ID (e.g., en-US, es-ES)"
                        name="cultureId"
                        value={formData.cultureId || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700" htmlFor="name">Name</label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="name"
                        type="text"
                        placeholder="Culture name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Culture'}
                    </button>
                    <Link
                        to="/cultures"
                        className="px-6 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default CultureCreate;