import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow (Manus OAuth).
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Admin users table for administrative access (separate from OAuth)
 */
export const adminUsers = mysqlTable("admin_users", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: text("name").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn"),
});

export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;

/**
 * Courses table - dynamic course management
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Renomeado de title para name
  title: varchar("title", { length: 255 }).notNull(), // Mantido para compatibilidade
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }), // Graduação, Técnico, etc.
  description: text("description").notNull(),
  objectives: text("objectives"), // Objetivos do curso
  syllabus: text("syllabus"), // Ementa do curso (conteúdo programático)
  jobMarket: text("jobMarket"), // Mercado de trabalho
  requirements: text("requirements"), // Requisitos para matrícula
  technicalRequirements: text("technicalRequirements"), // Requisitos técnicos (PC, internet, etc.)
  duration: varchar("duration", { length: 100 }).notNull(),
  modality: varchar("modality", { length: 50 }).notNull(),
  image: text("image"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Course curriculum table - grades curriculares
 */
export const courseCurriculum = mysqlTable("course_curriculum", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  semester: int("semester").notNull(),
  subjectName: varchar("subjectName", { length: 255 }).notNull(),
  workload: int("workload").notNull(),
  description: text("description"),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseCurriculum = typeof courseCurriculum.$inferSelect;
export type InsertCourseCurriculum = typeof courseCurriculum.$inferInsert;

/**
 * Blog posts table - dynamic blog management
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  image: text("image"),
  readTime: varchar("readTime", { length: 50 }),
  isPublished: boolean("isPublished").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  externalLink: text("externalLink"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Blog post gallery table - images for blog post carousel
 */
export const blogPostGallery = mysqlTable("blog_post_gallery", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("post_id").notNull(),
  imageUrl: text("image_url").notNull(),
  orderIndex: int("order_index").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type BlogPostGalleryImage = typeof blogPostGallery.$inferSelect;
export type InsertBlogPostGalleryImage = typeof blogPostGallery.$inferInsert;

/**
 * Testimonials table - partner testimonials management
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }),
  testimonial: text("testimonial").notNull(),
  rating: int("rating").default(5).notNull(),
  image: text("image"),
  videoUrl: text("videoUrl"), // URL do vídeo (YouTube, Vimeo ou upload)
  courseName: varchar("courseName", { length: 255 }), // Nome do curso relacionado
  isActive: boolean("isActive").default(true).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Hero banners table - homepage slider management
 */
export const heroBanners = mysqlTable("hero_banners", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: text("subtitle"),
  image: text("image").notNull(),
  ctaText: varchar("ctaText", { length: 100 }),
  ctaLink: varchar("ctaLink", { length: 500 }),
  displayDuration: int("displayDuration").default(10),
  textPosition: mysqlEnum("textPosition", ["left", "center", "right"]).default("left"),
  overlayOpacity: int("overlayOpacity").default(50),
  showContent: boolean("showContent").default(true).notNull(),
  order: int("order").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HeroBanner = typeof heroBanners.$inferSelect;
export type InsertHeroBanner = typeof heroBanners.$inferInsert;

/**
 * Certifications table - certification seals management
 */
export const certifications = mysqlTable("certifications", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image").notNull(),
  order: int("order").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = typeof certifications.$inferInsert;

/**
 * Site settings table - general site configuration
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Course categories table - dynamic course categories
 */
export const courseCategories = mysqlTable("course_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseCategory = typeof courseCategories.$inferSelect;
export type InsertCourseCategory = typeof courseCategories.$inferInsert;

/**
 * Course types table - dynamic course types
 */
export const courseTypes = mysqlTable("course_types", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseType = typeof courseTypes.$inferSelect;
export type InsertCourseType = typeof courseTypes.$inferInsert;

/**
 * Partnership requests table - store partnership applications
 */
export const partnershipRequests = mysqlTable("partnership_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["pending", "in_review", "approved", "rejected"]).default("pending").notNull(),
  notes: text("notes"), // Notas internas do admin
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PartnershipRequest = typeof partnershipRequests.$inferSelect;
export type InsertPartnershipRequest = typeof partnershipRequests.$inferInsert;

/**
 * Ombudsman messages table - store ombudsman/complaint messages
 */
export const ombudsmanMessages = mysqlTable("ombudsman_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["pending", "in_review", "resolved", "closed"]).default("pending").notNull(),
  response: text("response"), // Resposta do admin
  notes: text("notes"), // Notas internas do admin
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OmbudsmanMessage = typeof ombudsmanMessages.$inferSelect;
export type InsertOmbudsmanMessage = typeof ombudsmanMessages.$inferInsert;

/**
 * Pageviews table - track website analytics
 */
export const pageviews = mysqlTable("pageviews", {
  id: int("id").autoincrement().primaryKey(),
  path: varchar("path", { length: 500 }).notNull(),
  referrer: varchar("referrer", { length: 500 }),
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  sessionId: varchar("sessionId", { length: 100 }),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type Pageview = typeof pageviews.$inferSelect;
export type InsertPageview = typeof pageviews.$inferInsert;


/**
 * About page hero section management
 */
export const aboutHero = mysqlTable("about_hero", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  badgeText: varchar("badge_text", { length: 50 }),
  badgeValue: varchar("badge_value", { length: 50 }),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export type AboutHero = typeof aboutHero.$inferSelect;
export type InsertAboutHero = typeof aboutHero.$inferInsert;

/**
 * About page timeline management
 */
export const aboutTimeline = mysqlTable("about_timeline", {
  id: int("id").autoincrement().primaryKey(),
  year: varchar("year", { length: 20 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  tag: varchar("tag", { length: 50 }),
  imageUrl: varchar("image_url", { length: 255 }),
  orderIndex: int("order_index").default(0),
  isActive: boolean("is_active").default(true),
});

export type AboutTimeline = typeof aboutTimeline.$inferSelect;
export type InsertAboutTimeline = typeof aboutTimeline.$inferInsert;

/**
 * About page units management
 */
export const aboutUnits = mysqlTable("about_units", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  orderIndex: int("order_index").default(0),
  isActive: boolean("is_active").default(true),
});

export type AboutUnit = typeof aboutUnits.$inferSelect;
export type InsertAboutUnit = typeof aboutUnits.$inferInsert;

/**
 * About page footer quote management
 */
export const aboutFooterQuote = mysqlTable("about_footer_quote", {
  id: int("id").autoincrement().primaryKey(),
  quote: text("quote").notNull(),
  author: varchar("author", { length: 255 }),
  authorRole: varchar("author_role", { length: 255 }),
});

export type AboutFooterQuote = typeof aboutFooterQuote.$inferSelect;
export type InsertAboutFooterQuote = typeof aboutFooterQuote.$inferInsert;
