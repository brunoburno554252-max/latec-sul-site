import { eq, and, gt, gte, lt, lte, sql, desc } from "drizzle-orm";
import { getDb } from "./db";
import {
  adminUsers,
  InsertAdminUser,
  AdminUser,
  courses,
  InsertCourse,
  Course,
  courseCurriculum,
  InsertCourseCurriculum,
  CourseCurriculum,
  blogPosts,
  InsertBlogPost,
  BlogPost,
  blogPostGallery,
  InsertBlogPostGalleryImage,
  BlogPostGalleryImage,
  heroBanners,
  InsertHeroBanner,
  HeroBanner,
  certifications,
  InsertCertification,
  Certification,
  siteSettings,
  InsertSiteSetting,
  SiteSetting,
  courseCategories,
  InsertCourseCategory,
  CourseCategory,
  courseTypes,
  InsertCourseType,
  CourseType,
  testimonials,
  InsertTestimonial,
  Testimonial,
  aboutHero,
  InsertAboutHero,
  aboutTimeline,
  InsertAboutTimeline,
  aboutUnits,
  InsertAboutUnit,
  aboutFooterQuote,
  InsertAboutFooterQuote,
} from "../drizzle/schema";

// ==================== Admin Users ====================

export async function getAdminByUsername(username: string): Promise<AdminUser | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
  return result[0];
}

export async function createAdminUser(admin: InsertAdminUser): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(adminUsers).values(admin);
}

export async function updateAdminLastSignIn(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  await db.update(adminUsers).set({ lastSignedIn: new Date() }).where(eq(adminUsers.id, id));
}

// ==================== Courses ====================

export async function getAllCourses(): Promise<Course[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(courses).orderBy(desc(courses.createdAt));
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  return result[0];
}

export async function createCourse(course: InsertCourse): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(courses).values(course);
  return Number(result[0].insertId);
}

export async function updateCourse(id: number, course: Partial<InsertCourse>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courses).set(course).where(eq(courses.id, id));
}

export async function deleteCourse(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete curriculum first
  await db.delete(courseCurriculum).where(eq(courseCurriculum.courseId, id));
  // Then delete course
  await db.delete(courses).where(eq(courses.id, id));
}

// ==================== Course Curriculum ====================

export async function getCourseCurriculum(courseId: number): Promise<CourseCurriculum[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(courseCurriculum).where(eq(courseCurriculum.courseId, courseId));
}

export async function createCurriculumItem(item: InsertCourseCurriculum): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(courseCurriculum).values(item);
}

export async function updateCurriculumItem(id: number, item: Partial<InsertCourseCurriculum>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courseCurriculum).set(item).where(eq(courseCurriculum.id, id));
}

export async function deleteCurriculumItem(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(courseCurriculum).where(eq(courseCurriculum.id, id));
}

// ==================== Blog Posts ====================

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(blogPosts).where(eq(blogPosts.isPublished, true)).orderBy(desc(blogPosts.publishedAt));
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result[0];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function createBlogPost(post: InsertBlogPost): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogPosts).values(post);
  return Number(result[0].insertId);
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Delete gallery images first
  await db.delete(blogPostGallery).where(eq(blogPostGallery.postId, id));
  // Then delete the post
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ==================== Blog Post Gallery ====================

export async function getPostGallery(postId: number): Promise<BlogPostGalleryImage[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(blogPostGallery)
    .where(eq(blogPostGallery.postId, postId))
    .orderBy(blogPostGallery.orderIndex);
}

export async function addPostGalleryImage(postId: number, imageUrl: string, orderIndex: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(blogPostGallery).values({ postId, imageUrl, orderIndex });
}

export async function deletePostGallery(postId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogPostGallery).where(eq(blogPostGallery.postId, postId));
}

export async function deletePostGalleryImage(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogPostGallery).where(eq(blogPostGallery.id, id));
}

export async function toggleBlogPostFeatured(id: number, featured: boolean): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogPosts).set({ featured }).where(eq(blogPosts.id, id));
}

// ==================== Hero Banners ====================

export async function getAllHeroBanners(): Promise<HeroBanner[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(heroBanners).orderBy(heroBanners.order);
}

export async function getActiveHeroBanners(): Promise<HeroBanner[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(heroBanners).where(eq(heroBanners.isActive, true)).orderBy(heroBanners.order);
}

export async function createHeroBanner(banner: InsertHeroBanner): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(heroBanners).values(banner);
}

export async function updateHeroBanner(id: number, banner: Partial<InsertHeroBanner>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(heroBanners).set(banner).where(eq(heroBanners.id, id));
}

export async function deleteHeroBanner(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(heroBanners).where(eq(heroBanners.id, id));
}

export async function reorderHeroBanner(id: number, newOrder: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get the current banner
  const banner = await db.select().from(heroBanners).where(eq(heroBanners.id, id)).limit(1);
  if (!banner || banner.length === 0) throw new Error("Banner not found");
  
  const currentOrder = banner[0].order;
  
  if (currentOrder === newOrder) return;
  
  // Update orders of affected banners
  if (newOrder < currentOrder) {
    // Moving up: shift others down
    await db.update(heroBanners)
      .set({ order: sql`${heroBanners.order} + 1` })
      .where(and(
        gte(heroBanners.order, newOrder),
        lt(heroBanners.order, currentOrder)
      ));
  } else {
    // Moving down: shift others up
    await db.update(heroBanners)
      .set({ order: sql`${heroBanners.order} - 1` })
      .where(and(
        gt(heroBanners.order, currentOrder),
        lte(heroBanners.order, newOrder)
      ));
  }
  
  // Update the target banner
  await db.update(heroBanners)
    .set({ order: newOrder })
    .where(eq(heroBanners.id, id));
}

// ==================== Certifications ====================

export async function getAllCertifications(): Promise<Certification[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(certifications).orderBy(certifications.order);
}

export async function getActiveCertifications(): Promise<Certification[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(certifications).where(eq(certifications.isActive, true)).orderBy(certifications.order);
}

export async function createCertification(cert: InsertCertification): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(certifications).values(cert);
}

export async function updateCertification(id: number, cert: Partial<InsertCertification>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(certifications).set(cert).where(eq(certifications.id, id));
}

export async function deleteCertification(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(certifications).where(eq(certifications.id, id));
}

// ==================== Site Settings ====================

export async function getAllSettings(): Promise<SiteSetting[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(siteSettings);
}

export async function getSettingByKey(key: string): Promise<SiteSetting | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result[0];
}

export async function upsertSetting(setting: InsertSiteSetting): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(siteSettings).values(setting).onDuplicateKeyUpdate({
    set: { value: setting.value, updatedAt: new Date() },
  });
}

export async function deleteSetting(key: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(siteSettings).where(eq(siteSettings.key, key));
}

// ==================== Course Categories ====================

export async function getAllCategories(): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  
  const categories = await db.select().from(courseCategories).orderBy(courseCategories.name);
  const allCourses = await getAllCourses();
  
  return categories.map(cat => ({
    ...cat,
    courseCount: allCourses.filter(c => c.category === cat.name && c.isActive).length,
  }));
}

export async function getCategoryById(id: number): Promise<CourseCategory | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(courseCategories).where(eq(courseCategories.id, id)).limit(1);
  return result[0];
}

export async function createCategory(category: InsertCourseCategory): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(courseCategories).values(category);
}

export async function updateCategory(id: number, category: Partial<InsertCourseCategory>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courseCategories).set(category).where(eq(courseCategories.id, id));
}

export async function deleteCategory(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(courseCategories).where(eq(courseCategories.id, id));
}

// ==================== Course Types ====================

export async function getAllTypes(): Promise<CourseType[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(courseTypes).orderBy(courseTypes.name);
}

export async function getTypeById(id: number): Promise<CourseType | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(courseTypes).where(eq(courseTypes.id, id)).limit(1);
  return result[0];
}

export async function createType(type: InsertCourseType): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(courseTypes).values(type);
}

export async function updateType(id: number, type: Partial<InsertCourseType>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(courseTypes).set(type).where(eq(courseTypes.id, id));
}

export async function deleteType(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(courseTypes).where(eq(courseTypes.id, id));
}


// ==================== Testimonials ====================

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(testimonials).orderBy(testimonials.order, desc(testimonials.createdAt));
}

export async function getTestimonialById(id: number): Promise<Testimonial | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return result[0];
}

export async function createTestimonial(testimonial: InsertTestimonial): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(testimonials).values(testimonial);
  return Number(result[0].insertId);
}

export async function updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(testimonials).set(testimonial).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ==================== About Page ====================

export async function getAboutHero() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aboutHero).limit(1);
  return result[0];
}

export async function updateAboutHero(id: number, data: Partial<InsertAboutHero>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(aboutHero).set(data).where(eq(aboutHero.id, id));
}

export async function getAllAboutTimeline() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(aboutTimeline).orderBy(aboutTimeline.orderIndex);
}

export async function createAboutTimeline(item: InsertAboutTimeline) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(aboutTimeline).values(item);
}

export async function updateAboutTimeline(id: number, data: Partial<InsertAboutTimeline>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(aboutTimeline).set(data).where(eq(aboutTimeline.id, id));
}

export async function deleteAboutTimeline(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(aboutTimeline).where(eq(aboutTimeline.id, id));
}

export async function getAllAboutUnits() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(aboutUnits).orderBy(aboutUnits.orderIndex);
}

export async function createAboutUnit(unit: InsertAboutUnit) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(aboutUnits).values(unit);
}

export async function updateAboutUnit(id: number, data: Partial<InsertAboutUnit>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(aboutUnits).set(data).where(eq(aboutUnits.id, id));
}

export async function deleteAboutUnit(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(aboutUnits).where(eq(aboutUnits.id, id));
}

export async function getAboutFooterQuote() {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aboutFooterQuote).limit(1);
  return result[0];
}

export async function updateAboutFooterQuote(id: number, data: Partial<InsertAboutFooterQuote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(aboutFooterQuote).set(data).where(eq(aboutFooterQuote.id, id));
}
export async function getAboutStory() {
  try {
    // @ts-ignore
    const result = await db.select().from(aboutStory).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching about story:', error);
    return null;
  }
}
