import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Culture } from '../interfaces/Culture';
import { cultureService } from '../services/CultureService';
import { useObjectDetails, useObjectForm } from '../hooks/useObjects';
import Swal from 'sweetalert2';

const CultureEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { object: culture, loading, error, updateObject } = useObjectDetails<Culture>(cultureService, id);
    const { formData, setFormData, handleInputChange, resetError } = useObjectForm<Culture>({
        cultureId: '',
        name: '',
        modifiedDate: new Date().toISOString()
    });
    const [saving, setSaving] = React.useState<boolean>(false);

    useEffect(() => {
        if (culture) setFormData(culture);
    }, [culture, setFormData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetError();

        const result = await Swal.fire({
            title: 'Confirm changes?',
            text: `Do you want to save changes for ${formData.name}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, save',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            setSaving(true);
            try {
                if (!formData.cultureId?.trim()) throw new Error('Culture ID is required');
                if (!formData.name?.trim()) throw new Error('Name is required');

                // Update modified date
                const updatedCulture = {
                    ...formData,
                    modifiedDate: new Date().toISOString()
                } as Culture;

                if (id) {
                    await updateObject(updatedCulture);
                    Swal.fire('Saved!', 'The culture has been updated.', 'success');
                    navigate('/cultures');
                }
            } catch (err) {
                Swal.fire('Error', (err as Error).message || 'Error updating the culture.', 'error');
                console.error('Error updating culture:', err);
            } finally {
                setSaving(false);
            }
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen text-xl text-gray-600">Loading...</div>;
    if (error && !culture) return <div className="max-w-2xl p-4 mx-auto mt-10 text-center text-red-600 bg-red-100 rounded-lg">{error}</div>;
    if (!culture && !loading) return <div className="max-w-2xl p-4 mx-auto mt-10 text-center text-gray-600 bg-gray-100 rounded-lg">Culture not found</div>;

    return (
        <div className="container max-w-2xl p-6 mx-auto">
            <h1 className="mb-6 text-3xl font-bold text-gray-800">Edit Culture</h1>
            {error && <div className="p-4 mb-6 text-white bg-red-600 rounded-lg shadow">{error}</div>}

            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-lg">
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Culture ID</label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none"
                        type="text"
                        value={formData.cultureId || ''}
                        disabled
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

                <div className="mb-5">
                    <label className="block mb-2 text-sm font-semibold text-gray-700">Last Modified</label>
                    <input
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border rounded-lg focus:outline-none"
                        type="text"
                        value={new Date(formData.modifiedDate || '').toLocaleString()}
                        disabled
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
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

export default CultureEdit;