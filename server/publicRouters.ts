import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import * as adminDb from "./adminDb";

// Public routers for frontend (no authentication required)
export const publicCoursesRouter = router({
  getAll: publicProcedure.query(async () => {
    // Get only active courses
    const courses = await adminDb.getAllCourses();
    return courses.filter(c => c.isActive);
  }),
  
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const course = await adminDb.getCourseBySlug(input.slug);
      if (!course || !course.isActive) {
        return null;
      }
      const curriculum = await adminDb.getCourseCurriculum(course.id);
      return { ...course, curriculum };
    }),
});

export const publicBlogRouter = router({
  getAll: publicProcedure.query(async () => {
    const posts = await adminDb.getAllBlogPosts();
    return posts.filter(p => p.isPublished);
  }),
  
  getFeatured: publicProcedure.query(async () => {
    const posts = await adminDb.getAllBlogPosts();
    return posts
      .filter(p => p.isPublished && p.featured)
      .sort((a: any, b: any) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime())
      .slice(0, 3); // Return max 3 featured posts
  }),
  
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const post = await adminDb.getBlogPostBySlug(input.slug);
      if (!post || !post.isPublished) return null;
      const galleryImages = await adminDb.getPostGallery(post.id);
      return {
        ...post,
        gallery: galleryImages.map(g => g.imageUrl),
      };
    }),
});

export const publicBannersRouter = router({
  getActive: publicProcedure.query(async () => {
    const banners = await adminDb.getAllHeroBanners();
    return banners
      .filter(b => b.isActive)
      .sort((a: any, b: any) => a.order - b.order);
  }),
});

export const publicCertificationsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await adminDb.getAllCertifications();
  }),
});

export const publicSettingsRouter = router({
  getAll: publicProcedure.query(async () => {
    return await adminDb.getAllSettings();
  }),
});

export const publicCategoriesRouter = router({
  getAll: publicProcedure.query(async () => {
    const categories = await adminDb.getAllCategories();
    return categories.filter((c: any) => c.isActive);
  }),
});

export const publicTypesRouter = router({
  getAll: publicProcedure.query(async () => {
    const types = await adminDb.getAllTypes();
    return types.filter((t: any) => t.isActive);
  }),
});

export const publicTestimonialsRouter = router({
  getAll: publicProcedure.query(async () => {
    const testimonials = await adminDb.getAllTestimonials();
    return testimonials.filter((t: any) => t.isActive);
  }),
});
export const publicAboutRouter = router({
  getHero: publicProcedure.query(async () => {
    return await adminDb.getAboutHero();
  }),
  getTimeline: publicProcedure.query(async () => {
    const timeline = await adminDb.getAllAboutTimeline();
    return timeline.filter((t: any) => t.isActive).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
  }),
  getUnits: publicProcedure.query(async () => {
    const units = await adminDb.getAllAboutUnits();
    return units.filter((u: any) => u.isActive).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
  }),
  getFooterQuote: publicProcedure.query(async () => {
    return await adminDb.getAboutFooterQuote();
  }),
  getStory: publicProcedure.query(async () => {
    // @ts-ignore - about_story might not be in types yet
    const story = await adminDb.getAboutStory();
    return story;
  }),
});
