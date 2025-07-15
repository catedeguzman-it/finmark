import { NextResponse } from 'next/server';
import { db } from '@/db';
import { usersTable } from '@/db/schema';

export async function GET() {
  try {
    // Test basic database connection
    const result = await db.select().from(usersTable).limit(1);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database connection successful',
      userCount: result.length,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    }, { status: 500 });
  }
}