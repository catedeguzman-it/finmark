/**
 * Demo file showing how to use the integrated Drizzle + Supabase system
 * This file demonstrates common patterns for the FinMark application
 */

import { getCurrentUser } from './auth';
import { createOrganization, addUserToOrganization } from './organizations';
import { db } from '../index';
import { accountsTable, transactionsTable, categoriesTable } from '../schema';

/**
 * Example: Create a complete financial setup for a new user
 */
export async function setupUserFinancials() {
  // Get the current authenticated user
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  // Create a personal organization
  const organization = await createOrganization({
    name: `${user.profile.name}'s Finance`,
    description: 'Personal financial management',
  });

  // Add user to the organization as admin
  await addUserToOrganization(user.profile.id, organization.id, 'admin');

  // Create default accounts
  const checkingAccount = await db.insert(accountsTable).values({
    organizationId: organization.id,
    name: 'Checking Account',
    type: 'checking',
    balance: '1000.00',
  }).returning();

  const savingsAccount = await db.insert(accountsTable).values({
    organizationId: organization.id,
    name: 'Savings Account',
    type: 'savings',
    balance: '5000.00',
  }).returning();

  // Create default categories
  const categories = await db.insert(categoriesTable).values([
    {
      organizationId: organization.id,
      name: 'Groceries',
      type: 'expense',
      color: '#ef4444',
    },
    {
      organizationId: organization.id,
      name: 'Salary',
      type: 'income',
      color: '#22c55e',
    },
    {
      organizationId: organization.id,
      name: 'Entertainment',
      type: 'expense',
      color: '#8b5cf6',
    },
  ]).returning();

  // Create a sample transaction
  await db.insert(transactionsTable).values({
    accountId: checkingAccount[0].id,
    amount: '-50.00',
    description: 'Weekly grocery shopping',
    category: 'Groceries',
    transactionDate: new Date(),
  });

  return {
    organization,
    accounts: [checkingAccount[0], savingsAccount[0]],
    categories,
  };
}

/**
 * Example: Get user's financial overview
 */
export async function getUserFinancialOverview() {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  // This would typically involve complex queries joining multiple tables
  // For now, this is a simplified example
  
  return {
    userId: user.profile.id,
    userName: user.profile.name,
    email: user.profile.email,
    // Add more financial data queries here
  };
} 