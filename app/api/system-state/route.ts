import { NextResponse } from 'next/server';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { count } from 'drizzle-orm';

export async function GET() {
  try {
    const [result] = await db.select({ count: count() }).from(usersTable);
    const hasUsers = result.count > 0;
    
    return NextResponse.json({ 
      hasUsers,
      userCount: result.count,
      needsBootstrap: !hasUsers 
    });
  } catch (error) {
    console.error('Failed to check system state:', error);
    return NextResponse.json(
      { error: 'Failed to check system state' },
      { status: 500 }
    );
  }
}