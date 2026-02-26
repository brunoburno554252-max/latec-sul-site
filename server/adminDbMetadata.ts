import { getDb } from './db';
import { courseCategories, courseTypes, partnershipRequests } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

// ===== Course Categories =====

export async function getAllCategories() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return await db.select().from(courseCategories).orderBy(courseCategories.name);
}

export async function createCategory(data: { name: string; slug: string; description?: string; image?: string }) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(courseCategories).values(data);
  return result[0].insertId;
}

export async function updateCategory(id: number, data: Partial<{ name: string; slug: string; description: string; image: string; isActive: boolean }>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(courseCategories).set(data).where(eq(courseCategories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(courseCategories).where(eq(courseCategories.id, id));
}

// ===== Course Types =====

export async function getAllTypes() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return await db.select().from(courseTypes).orderBy(courseTypes.name);
}

export async function createType(data: { name: string; slug: string; description?: string }) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(courseTypes).values(data);
  return result[0].insertId;
}

export async function updateType(id: number, data: Partial<{ name: string; slug: string; description: string; isActive: boolean }>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(courseTypes).set(data).where(eq(courseTypes.id, id));
}

export async function deleteType(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(courseTypes).where(eq(courseTypes.id, id));
}

// ===== Partnership Requests =====

export async function getAllPartnershipRequests() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return await db.select().from(partnershipRequests).orderBy(partnershipRequests.createdAt);
}

export async function createPartnershipRequest(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(partnershipRequests).values(data);
  return result[0].insertId;
}

export async function updatePartnershipRequest(id: number, data: Partial<{
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  notes: string;
}>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.update(partnershipRequests).set(data).where(eq(partnershipRequests.id, id));
}

export async function deletePartnershipRequest(id: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  await db.delete(partnershipRequests).where(eq(partnershipRequests.id, id));
}
