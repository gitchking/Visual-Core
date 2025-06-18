import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const OAuthTest: React.FC = () => {
  const { user } = useAuth();

  const checkSupabaseConfig = () => {
    const hasValidCredentials = supabase !== null;
    console.log('Supabase configured:', hasValidCredentials);
    console.log('Supabase client:', supabase);
    alert(`Supabase configured: ${hasValidCredentials ? 'Yes' : 'No'}`);
  };

  const checkEnvironmentVariables = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('Environment variables:');
    console.log('VITE_SUPABASE_URL:', supabaseUrl);
    console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '***' + supabaseKey.slice(-4) : 'missing');
    
    const hasValidUrl = supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co';
    const hasValidKey = supabaseKey && supabaseKey !== 'your-anon-key-here' && supabaseKey.startsWith('eyJ');
    
    alert(`Environment Variables:\nURL: ${hasValidUrl ? 'Valid' : 'Invalid'}\nKey: ${hasValidKey ? 'Valid' : 'Invalid'}`);
  };

  return (
    <Card className="w-full max-w-md neo-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {user ? <CheckCircle className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-yellow-500" />}
          Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600">
          {user ? (
            <p>✅ User authenticated: {user.email}</p>
          ) : (
            <p>⚠️ No user authenticated</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Button
            onClick={checkSupabaseConfig}
            variant="outline"
            className="w-full neo-brutal"
          >
            <Database size={16} className="mr-2" />
            Check Supabase Config
          </Button>
          
          <Button
            onClick={checkEnvironmentVariables}
            variant="outline"
            className="w-full neo-brutal"
          >
            Check Environment Variables
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          <p>💡 Check browser console for detailed logs</p>
          <p>🔧 Use this to debug authentication issues</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OAuthTest; 