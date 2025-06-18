import React from 'react';

const OAuthTest: React.FC = () => (
  <div className="p-4 text-center">
    <h2 className="text-lg font-semibold mb-2">OAuth Test</h2>
    <p>OAuth is not supported in local/SQLite authentication mode.</p>
  </div>
);

export default OAuthTest; 