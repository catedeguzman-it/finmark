import { eq, and } from 'drizzle-orm';
import { db } from '@/db';
import { userInvitationsTable, type InsertUserInvitation, type SelectUserInvitation } from '@/db/schema';
import { randomBytes } from 'crypto';

export async function createInvitation(data: Omit<InsertUserInvitation, 'token' | 'expiresAt'>) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

  const [invitation] = await db.insert(userInvitationsTable).values({
    ...data,
    token,
    expiresAt,
  }).returning();

  return invitation;
}

export async function getInvitationByToken(token: string): Promise<SelectUserInvitation | null> {
  const [invitation] = await db
    .select()
    .from(userInvitationsTable)
    .where(eq(userInvitationsTable.token, token))
    .limit(1);

  return invitation || null;
}

export async function getInvitationsByOrganization(organizationId: number): Promise<SelectUserInvitation[]> {
  return await db
    .select()
    .from(userInvitationsTable)
    .where(eq(userInvitationsTable.organizationId, organizationId))
    .orderBy(userInvitationsTable.createdAt);
}

export async function acceptInvitation(token: string): Promise<SelectUserInvitation | null> {
  const [invitation] = await db
    .update(userInvitationsTable)
    .set({
      status: 'accepted',
      acceptedAt: new Date(),
    })
    .where(
      and(
        eq(userInvitationsTable.token, token),
        eq(userInvitationsTable.status, 'pending')
      )
    )
    .returning();

  return invitation || null;
}

export async function expireInvitation(token: string): Promise<void> {
  await db
    .update(userInvitationsTable)
    .set({ status: 'expired' })
    .where(eq(userInvitationsTable.token, token));
}

export async function deleteInvitation(id: number): Promise<void> {
  await db
    .delete(userInvitationsTable)
    .where(eq(userInvitationsTable.id, id));
}

export async function getValidInvitation(token: string): Promise<SelectUserInvitation | null> {
  const [invitation] = await db
    .select()
    .from(userInvitationsTable)
    .where(
      and(
        eq(userInvitationsTable.token, token),
        eq(userInvitationsTable.status, 'pending')
      )
    )
    .limit(1);

  if (!invitation) return null;

  // Check if expired
  if (new Date() > invitation.expiresAt) {
    await expireInvitation(token);
    return null;
  }

  return invitation;
}