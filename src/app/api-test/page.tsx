'use client';

import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if API URL is set
    const url = process.env.NEXT_PUBLIC_API_URL || 'NOT SET';
    setApiUrl(url);
  }, []);

  const testEndpoint = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const url = `${apiUrl}/auth/login.php`;
      console.log('Testing URL:', url);

      const response = await fetch(url, {
        method: 'GET', // Will return "Method not allowed" but proves connectivity
      });

      const data = await response.json();
      
      setTestResult({
        success: true,
        status: response.status,
        data: data,
        url: url,
      });
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        url: `${apiUrl}/auth/login.php`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🧪 API Connection Test</h1>
        
        <div className="bg-card p-6 rounded-lg elevation-2 mb-4">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="bg-muted p-4 rounded">
            <p className="font-mono text-sm">
              <strong>NEXT_PUBLIC_API_URL:</strong>{' '}
              {apiUrl || 'NOT SET ❌'}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg elevation-2 mb-4">
          <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
          <button
            onClick={testEndpoint}
            disabled={loading || !apiUrl}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test PHP API Connection'}
          </button>
        </div>

        {testResult && (
          <div className="bg-card p-6 rounded-lg elevation-2">
            <h2 className="text-xl font-semibold mb-4">
              {testResult.success ? '✅ Result' : '❌ Error'}
            </h2>
            <div className="bg-muted p-4 rounded">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>

            {testResult.success && testResult.data?.message === 'Method not allowed' && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500 rounded-lg">
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  ✅ PHP API is accessible and responding correctly!
                </p>
                <p className="text-sm mt-2">
                  The "Method not allowed" error is expected for GET requests.
                  POST requests will work fine.
                </p>
              </div>
            )}

            {!testResult.success && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
                <p className="text-red-600 dark:text-red-400 font-semibold">
                  ❌ Cannot reach PHP API
                </p>
                <p className="text-sm mt-2">
                  Check that:
                </p>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>PHP files are uploaded to SmartWeb</li>
                  <li>NEXT_PUBLIC_API_URL is set correctly</li>
                  <li>CORS is configured properly</li>
                  <li>The domain is accessible</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">📝 Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Make sure <code className="bg-background px-2 py-1 rounded">.env.local</code> has NEXT_PUBLIC_API_URL</li>
            <li>Restart dev server after changing .env.local</li>
            <li>Upload updated <code className="bg-background px-2 py-1 rounded">cors.php</code> to SmartWeb</li>
            <li>Click "Test PHP API Connection" button</li>
            <li>If successful, login should work!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

