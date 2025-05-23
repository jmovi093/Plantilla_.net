import React from 'react';
import { Link } from 'react-router-dom';
import { Culture } from '../interfaces/Culture';
import { cultureService } from '../services/CultureService';
import { useObjects } from '../hooks/useObjects';
import Swal from 'sweetalert2';

// Import icons
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon } from '@heroicons/react/24/outline';

const CultureList: React.FC = () => {
  const { 
    objects: cultures, 
    loading, 
    error, 
    deleteObject 
  } = useObjects<Culture>(cultureService, {
    transformId: (culture) => culture.cultureId,
    onError: (err) => {
      console.error('Error in cultures list', err);
    }
  });

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the culture ${name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteObject(id)
          .then(() => {
            Swal.fire(
              'Deleted!',
              'The culture has been successfully deleted.',
              'success'
            );
          })
          .catch((err) => {
            Swal.fire(
              'Error',
              'An error occurred while deleting the culture.',
              'error'
            );
            console.error('Error when deleting:', err);
          });
      }
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center w-full h-32">
      <div className="p-6 text-xl font-semibold text-gray-700">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl p-6 mx-auto mt-4 text-lg font-medium text-center text-red-600 bg-red-100 rounded-lg">
      {error}
    </div>
  );

  return (
    <div className="container max-w-6xl p-6 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cultures</h1>
        <Link 
          to="/cultures/create" 
          className="flex items-center px-4 py-2 text-white transition duration-300 ease-in-out bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create New
        </Link>
      </div>
      
      <div className="overflow-hidden bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Last Modified</th>
              <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cultures.map(culture => (
              <tr key={culture.cultureId} className="transition-colors duration-150 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">{culture.cultureId}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{culture.name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                  {new Date(culture.modifiedDate).toLocaleString()}
                </td>
                <td className="px-6 py-4 space-x-2 text-sm font-medium text-right whitespace-nowrap">
                  <Link 
                    to={`/cultures/details/${culture.cultureId}`} 
                    className="inline-flex items-center p-2 text-blue-600 transition-colors duration-150 bg-blue-100 rounded-md hover:bg-blue-200"
                    title="View details"
                  >
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                  <Link 
                    to={`/cultures/edit/${culture.cultureId}`} 
                    className="inline-flex items-center p-2 text-green-600 transition-colors duration-150 bg-green-100 rounded-md hover:bg-green-200"
                    title="Edit"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => handleDelete(culture.cultureId, culture.name)}
                    className="inline-flex items-center p-2 text-red-600 transition-colors duration-150 bg-red-100 rounded-md hover:bg-red-200"
                    title="Delete"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {cultures.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No cultures registered.
          </div>
        )}
      </div>
    </div>
  );
};

export default CultureList;