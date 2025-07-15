import { eq } from 'drizzle-orm';
import { db } from '../index';
import { 
  InsertOrganization, 
  SelectOrganization, 
  organizationsTable,
  userOrganizationsTable
} from '../schema';

export async function createOrganization(data: InsertOrganization) {
  const [organization] = await db.insert(organizationsTable).values(data).returning();
  return organization;
}

export async function getOrganizationById(id: SelectOrganization['id']): Promise<SelectOrganization | undefined> {
  const [organization] = await db.select().from(organizationsTable).where(eq(organizationsTable.id, id));
  return organization;
}

export async function getUserOrganizations(userId: number) {
  return db
    .select({
      organization: organizationsTable,
      isDefault: userOrganizationsTable.isDefault,
      joinedAt: userOrganizationsTable.createdAt,
    })
    .from(userOrganizationsTable)
    .innerJoin(organizationsTable, eq(userOrganizationsTable.organizationId, organizationsTable.id))
    .where(eq(userOrganizationsTable.userId, userId));
}

export async function addUserToOrganization(userId: number, organizationId: number, isDefault: boolean = false) {
  const [userOrg] = await db.insert(userOrganizationsTable)
    .values({ userId, organizationId, isDefault })
    .returning();
  return userOrg;
}

export async function updateOrganization(id: SelectOrganization['id'], data: Partial<Omit<SelectOrganization, 'id' | 'createdAt'>>) {
  const [organization] = await db.update(organizationsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(organizationsTable.id, id))
    .returning();
  return organization;
}

export async function getAllOrganizations(): Promise<SelectOrganization[]> {
  return await db.select().from(organizationsTable).orderBy(organizationsTable.createdAt);
} 