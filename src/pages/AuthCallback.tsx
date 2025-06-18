import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AuthCallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
    <Card className="w-full max-w-md neo-card">
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Not Needed</h2>
          <p className="text-gray-600">This page is not used with SQLite/local authentication.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AuthCallback; 