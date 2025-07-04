import { eq } from 'drizzle-orm';
import { db } from '../index';
import { InsertUser, SelectUser, usersTable } from '../schema';

export async function createUser(data: InsertUser) {
  const [user] = await db.insert(usersTable).values(data).returning();
  return user;
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