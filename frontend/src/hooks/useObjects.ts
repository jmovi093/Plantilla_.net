import { useState, useEffect, useMemo } from 'react';
import { BaseService } from '../services/base.service';
import { useErrorHandler } from './useErrorHandler';

interface UseObjectsOptions<T> {
  initialData?: T[];
  autoFetch?: boolean;
  onSuccess?: (data: T[]) => void;
  onError?: (error: any) => void;
  transformId?: (item: T) => number | string;
}

interface UseObjectDetailsOptions<T> {
  initialData?: T | null;
  autoFetch?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  transformId?: (item: T) => number | string;
}

export const useObjects = <T extends object>(
  service: BaseService<T>, 
  options: UseObjectsOptions<T> = {}
) => {
  const {
    initialData = [],
    autoFetch = true,
    onSuccess,
    onError,
    transformId = (item: any) => item.id || item.shipperId
  } = options;

  const [objects, setObjects] = useState<T[]>(initialData);
  const { error, loading, setLoading, handleError, resetError } = useErrorHandler();

  const fetchObjects = async () => {
    setLoading(true);
    try {
      const data = await service.getAll();
      setObjects(data);
      onSuccess?.(data);
    } catch (err) {
      handleError('Error al cargar los objetos', err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const createObject = async (object: T) => {
    try {
      const newObject = await service.create(object);
      setObjects(current => [...current, newObject]);
      return newObject;
    } catch (err) {
      handleError('Error al crear el objeto', err);
      throw err;
    }
  };

  const updateObject = async (id: number | string, object: T) => {
    try {
      const updatedObject = await service.update(Number(id), object);
      setObjects(current => 
        current.map(obj => transformId(obj) === id ? updatedObject : obj)
      );
      return updatedObject;
    } catch (err) {
      handleError('Error al actualizar el objeto', err);
      throw err;
    }
  };

  const deleteObject = async (id: number | string) => {
    try {
      await service.delete(Number(id));
      setObjects(current => 
        current.filter(obj => transformId(obj) !== id)
      );
    } catch (err) {
      handleError('Error al eliminar el objeto', err);
      throw err;
    }
  };

  const getObjectById = (id: number | string) => {
    return objects.find(obj => transformId(obj) === id);
  };

  useEffect(() => {
    if (autoFetch) {
      fetchObjects();
    }
  }, []);

  const filteredObjects = useMemo(() => objects, [objects]);
  const sortedObjects = useMemo(() => 
    [...filteredObjects].sort((a, b) => 
      String(transformId(a)).localeCompare(String(transformId(b)))
    ), 
    [filteredObjects]
  );

  return {
    objects: sortedObjects,
    loading,
    error,
    fetchObjects,
    createObject,
    updateObject,
    deleteObject,
    getObjectById,
    resetError,
    setObjects
  };
};

// Updated hook for object details with consistent pattern
export const useObjectDetails = <T extends object>(
  service: BaseService<T>, 
  id?: number | string,
  options: UseObjectDetailsOptions<T> = {}
) => {
  const {
    initialData = null,
    autoFetch = true,
    onSuccess,
    onError,
    transformId = (item: any) => item.id || item.shipperId
  } = options;

  const [object, setObject] = useState<T | null>(initialData);
  const { error, loading, setLoading, handleError, resetError } = useErrorHandler();

  const fetchObjectDetails = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const data = await service.getById(Number(id));
      setObject(data);
      onSuccess?.(data);
    } catch (err) {
      handleError('Error al cargar los detalles del objeto', err);
      onError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const updateObject = async (updatedObject: T) => {
    if (!id) return null;
    
    try {
      const result = await service.update(Number(id), updatedObject);
      setObject(result);
      return result;
    } catch (err) {
      handleError('Error al actualizar el objeto', err);
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && id) {
      fetchObjectDetails();
    }
  }, [id]);

  return {
    object,
    loading,
    error,
    fetchObjectDetails,
    updateObject,
    setObject,
    resetError
  };
};

// Hook de formulario genérico
export const useObjectForm = <T>(initialState: Partial<T> = {}) => {
  const [formData, setFormData] = useState<Partial<T>>(initialState);
  const { error, handleError, resetError } = useErrorHandler();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData(initialState);
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    resetForm,
    error,
    resetError
  };
};