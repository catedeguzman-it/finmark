import { eq } from 'drizzle-orm';
import { db } from '../index';
import { InsertUser, SelectUser, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  try {
    const [user] = await db.insert(usersTable).values(data).returning();
    return user;
  } catch (error: any) {
    // Handle duplicate constraint violations gracefully
    if (error?.code === '23505') {
      // Handle duplicate email
      if (error?.constraint_name === 'users_table_email_unique') {
        const existingUser = await getUserByEmail(data.email);
        if (existingUser) {
          return existingUser;
        }
      }
      
      // Handle duplicate auth_user_id (user already exists from previous signup attempt)
      if (error?.constraint_name === 'users_table_auth_user_id_unique') {
        const existingUser = await getUserByAuthId(data.authUserId);
        if (existingUser) {
          return existingUser;
        }
      }
      
      // If we get here, it's a constraint violation we don't handle
      throw new Error('User already exists. Please sign in instead.');
    }
    
    // Log the error for debugging
    console.error('Database error in createUser:', error);
    throw new Error('Failed to create user account. Please try again.');
  }
}

export async function getUserById(id: SelectUser['id']): Promise<SelectUser | undefined> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  return user;
}

export async function getUserByAuthId(authUserId: string): Promise<SelectUser | undefined> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.authUserId, authUserId));
  return user;
}

export async function getUserByEmail(email: string): Promise<SelectUser | undefined> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  return user;
}

export async function updateUser(id: SelectUser['id'], data: Partial<Omit<SelectUser, 'id' | 'createdAt'>>) {
  const [user] = await db.update(usersTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(usersTable.id, id))
    .returning();
  return user;
}

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
} 