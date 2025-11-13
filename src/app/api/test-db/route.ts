import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

/**
 * Test Database Connection API Route
 * 
 * This endpoint tests the connection to your cPanel MySQL database
 * Visit: https://your-app.vercel.app/api/test-db
 * 
 * ⚠️ SECURITY WARNING: Delete this file after testing!
 * This endpoint exposes database connection information
 */

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Log environment variables (without sensitive data)
    console.log('Testing database connection...');
    console.log('Host:', process.env.DATABASE_HOST);
    console.log('User:', process.env.DATABASE_USER);
    console.log('Database:', process.env.DATABASE_NAME);
    console.log('Port:', process.env.DATABASE_PORT || '3306');

    // Attempt connection
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: parseInt(process.env.DATABASE_PORT || '3306'),
      connectTimeout: 10000, // 10 seconds timeout
    });

    // Test query
    const [result] = await connection.execute('SELECT 1 as test, NOW() as server_time');
    
    // Get database version
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    
    // List tables in database
    const [tables] = await connection.execute('SHOW TABLES');
    
    await connection.end();
    
    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: '✅ Database connection successful!',
      details: {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        database: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT || '3306',
        // @ts-ignore
        mysqlVersion: versionResult[0]?.version,
        tablesCount: tables.length,
        tables: tables.map((t: any) => Object.values(t)[0]),
        responseTime: `${responseTime}ms`,
        serverTime: result[0],
      },
      warning: '⚠️ Remember to delete this test endpoint in production!'
    });
    
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    console.error('Database connection error:', error);
    
    // Provide helpful error messages
    let helpfulMessage = '';
    let possibleSolutions = [];
    
    if (error.code === 'ENOTFOUND') {
      helpfulMessage = 'Cannot find the database host. Check your DATABASE_HOST.';
      possibleSolutions = [
        'Verify DATABASE_HOST is not "localhost" or "127.0.0.1"',
        'Check if you\'re using the correct server hostname',
        'Try using the server IP address instead',
      ];
    } else if (error.code === 'ECONNREFUSED') {
      helpfulMessage = 'Connection refused. The database server might be blocking external connections.';
      possibleSolutions = [
        'Enable "Remote MySQL®" in cPanel',
        'Add "%" to Remote MySQL access hosts',
        'Contact your hosting provider to enable remote MySQL',
        'Check if port 3306 is open',
      ];
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      helpfulMessage = 'Access denied. Check your username and password.';
      possibleSolutions = [
        'Verify DATABASE_USER includes cPanel prefix (e.g., cpaneluser_dbuser)',
        'Verify DATABASE_NAME includes cPanel prefix (e.g., cpaneluser_dbname)',
        'Check password is correct (no extra spaces)',
        'Ensure user is added to database with privileges in cPanel',
      ];
    } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
      helpfulMessage = 'Connection timeout. The server took too long to respond.';
      possibleSolutions = [
        'Check if your hosting provider allows remote MySQL',
        'Verify firewall settings',
        'Try a different port if provided by your host',
        'Contact hosting support',
      ];
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      helpfulMessage = 'Database not found. Check your DATABASE_NAME.';
      possibleSolutions = [
        'Verify the database exists in cPanel',
        'Check DATABASE_NAME includes cPanel prefix',
        'Create the database in cPanel if it doesn\'t exist',
      ];
    }

    return NextResponse.json({
      success: false,
      message: '❌ Database connection failed',
      error: {
        code: error.code,
        message: error.message,
        helpfulMessage,
        possibleSolutions,
      },
      config: {
        host: process.env.DATABASE_HOST || 'NOT SET',
        user: process.env.DATABASE_USER || 'NOT SET',
        database: process.env.DATABASE_NAME || 'NOT SET',
        port: process.env.DATABASE_PORT || '3306',
        hasPassword: !!process.env.DATABASE_PASSWORD,
      },
      responseTime: `${responseTime}ms`,
      nextSteps: [
        '1. Check CPANEL-DATABASE-SETUP.md for detailed instructions',
        '2. Verify all environment variables are set in Vercel',
        '3. Ensure Remote MySQL is enabled in cPanel',
        '4. Contact hosting support if issues persist',
      ]
    }, { status: 500 });
  }
}

