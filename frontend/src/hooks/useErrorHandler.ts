// src/hooks/useErrorHandler.ts
import { useState } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleError = (message: string, logError?: any) => {
    setError(message);
    if (logError) {
      console.error(logError);
    }
  };

  const resetError = () => {
    setError(null);
  };

  return { 
    error, 
    loading, 
    setLoading, 
    handleError, 
    resetError 
  };
};