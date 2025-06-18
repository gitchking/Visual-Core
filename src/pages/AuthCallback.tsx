import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔍 AuthCallback Debug:');
        console.log('Supabase client exists:', !!supabase);
        console.log('URL search params:', Object.fromEntries(searchParams.entries()));
        
        // Check if we have a valid Supabase client
        if (!supabase) {
          console.error('❌ Supabase client is null - credentials may be invalid');
          setStatus('error');
          setMessage('Authentication service not configured. Please contact support.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        // Handle the auth callback from URL parameters
        console.log('🔄 Getting session...');
        const { data, error } = await supabase.auth.getSession();
        
        console.log('📊 Session data:', data);
        console.log('❌ Session error:', error);
        
        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => navigate('/'), 3000);
          return;
        }

        if (data?.session) {
          console.log('✅ Session found, user authenticated');
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          setTimeout(() => navigate('/'), 1500);
        } else {
          // Check if there are error parameters in the URL
          const errorParam = searchParams.get('error');
          const errorDescription = searchParams.get('error_description');
          
          console.log('⚠️ No session found');
          console.log('Error param:', errorParam);
          console.log('Error description:', errorDescription);
          
          if (errorParam) {
            setStatus('error');
            setMessage(errorDescription || 'Authentication failed. Please try again.');
          } else {
            setStatus('error');
            setMessage('No session found. Please try signing in again.');
          }
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md neo-card">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            {getIcon()}
            <h2 className="text-xl font-semibold text-gray-900">
              {status === 'loading' && 'Processing...'}
              {status === 'success' && 'Success!'}
              {status === 'error' && 'Error'}
            </h2>
            <p className="text-gray-600">{message}</p>
            {status === 'loading' && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback; 