import { eq, count } from 'drizzle-orm';
import { db } from '../index';
import { InsertUser, SelectUser, usersTable, userOrganizationsTable } from '../schema';

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
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.authUserId, authUserId));
    return user;
  } catch (error) {
    console.error('Database query failed in getUserByAuthId:', {
      authUserId,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
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

export async function updateUserProfile(id: SelectUser['id'], data: { name?: string; position?: string }) {
  const [user] = await db.update(usersTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(usersTable.id, id))
    .returning();
  return user;
}

export async function deleteUser(id: SelectUser['id']) {
  await db.delete(usersTable).where(eq(usersTable.id, id));
}

export async function hasAnyUsers(): Promise<boolean> {
  try {
    const [result] = await db.select({ count: count() }).from(usersTable);
    return result.count > 0;
  } catch (error) {
    console.error('Failed to check if users exist:', error);
    throw error;
  }
}

export async function getAllUsersWithOrganizations() {
  const { organizationsTable } = await import('../schema');
  
  return db
    .select({
      user: usersTable,
      organization: {
        id: userOrganizationsTable.organizationId,
        name: organizationsTable.name,
        isDefault: userOrganizationsTable.isDefault,
        joinedAt: userOrganizationsTable.createdAt,
      }
    })
    .from(usersTable)
    .leftJoin(userOrganizationsTable, eq(usersTable.id, userOrganizationsTable.userId))
    .leftJoin(organizationsTable, eq(userOrganizationsTable.organizationId, organizationsTable.id))
    .orderBy(usersTable.createdAt);
}

export async function getUsersInOrganization(organizationId: number) {
  return db
    .select({
      user: usersTable,
      isDefault: userOrganizationsTable.isDefault,
      joinedAt: userOrganizationsTable.createdAt,
    })
    .from(usersTable)
    .innerJoin(userOrganizationsTable, eq(usersTable.id, userOrganizationsTable.userId))
    .where(eq(userOrganizationsTable.organizationId, organizationId))
    .orderBy(usersTable.createdAt);
} 