import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "./_core/env";
import * as adminDb from "./adminDb";

// Admin authentication middleware
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const authHeader = ctx.req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "No token provided" });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, ENV.jwtSecret) as { adminId: number; username: string };
    return next({ ctx: { ...ctx, admin: decoded } });
  } catch (error) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid token" });
  }
});

export const adminAuthRouter = router({
  login: publicProcedure
    .input(z.object({
      username: z.string(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      const admin = await adminDb.getAdminByUsername(input.username);
      
      if (!admin || !admin.isActive) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(input.password, admin.passwordHash);
      
      if (!isValidPassword) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      }
      
      await adminDb.updateAdminLastSignIn(admin.id);
      
      const token = jwt.sign(
        { adminId: admin.id, username: admin.username },
        ENV.jwtSecret,
        { expiresIn: "7d" }
      );
      
      return {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          name: admin.name,
          email: admin.email,
        },
      };
    }),
  
  verifyToken: adminProcedure.query(async ({ ctx }) => {
    return { valid: true, admin: ctx.admin };
  }),
});

export const adminCoursesRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDb.getAllCourses();
  }),
  
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const course = await adminDb.getCourseById(input.id);
      if (!course) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Course not found" });
      }
      const curriculum = await adminDb.getCourseCurriculum(input.id);
      return { ...course, curriculum };
    }),
  
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      title: z.string(),
      slug: z.string(),
      category: z.string(),
      type: z.string().optional(),
      description: z.string(),
      objectives: z.string().optional(),
      syllabus: z.string().optional(),
      jobMarket: z.string().optional(),
      requirements: z.string().optional(),
      technicalRequirements: z.string().optional(),
      duration: z.string(),
      modality: z.string(),
      image: z.string().optional(),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const courseId = await adminDb.createCourse(input);
      return { id: courseId };
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      title: z.string().optional(),
      slug: z.string().optional(),
      category: z.string().optional(),
      type: z.string().optional(),
      description: z.string().optional(),
      objectives: z.string().optional(),
      syllabus: z.string().optional(),
      jobMarket: z.string().optional(),
      requirements: z.string().optional(),
      technicalRequirements: z.string().optional(),
      duration: z.string().optional(),
      modality: z.string().optional(),
      image: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDb.updateCourse(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDb.deleteCourse(input.id);
      return { success: true };
    }),
});

export const adminCurriculumRouter = router({
  getByCourseId: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return await adminDb.getCourseCurriculum(input.courseId);
    }),
  
  create: adminProcedure
    .input(z.object({
      courseId: z.number(),
      semester: z.number(),
      subjectName: z.string(),
      workload: z.number(),
      description: z.string().optional(),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      await adminDb.createCurriculumItem(input);
      return { success: true };
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      semester: z.number().optional(),
      subjectName: z.string().optional(),
      workload: z.number().optional(),
      description: z.string().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDb.updateCurriculumItem(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDb.deleteCurriculumItem(input.id);
      return { success: true };
    }),
  
  importFromPDF: adminProcedure
    .input(z.object({
      courseId: z.number(),
      pdfBase64: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { processCurriculumPDF } = await import("./pdfCurriculumParser");
      
      // Convert base64 to buffer
      const pdfBuffer = Buffer.from(input.pdfBase64, 'base64');
      
      // Process PDF and extract curriculum
      const curriculum = await processCurriculumPDF(pdfBuffer);
      
      // Return extracted data for preview
      return {
        success: true,
        data: curriculum,
      };
    }),
  
  saveParsedCurriculum: adminProcedure
    .input(z.object({
      courseId: z.number(),
      subjects: z.array(z.object({
        semester: z.number(),
        subjectName: z.string(),
        workload: z.number(),
        description: z.string().optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      // Delete existing curriculum for this course
      const existing = await adminDb.getCourseCurriculum(input.courseId);
      for (const item of existing) {
        await adminDb.deleteCurriculumItem(item.id);
      }
      
      // Insert new curriculum items
      for (let i = 0; i < input.subjects.length; i++) {
        const subject = input.subjects[i];
        await adminDb.createCurriculumItem({
          courseId: input.courseId,
          semester: subject.semester,
          subjectName: subject.subjectName,
          workload: subject.workload,
          description: subject.description,
          order: i,
        });
      }
      
      return { success: true };
    }),
});

export const adminBlogRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDb.getAllBlogPosts();
  }),
  
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const post = await adminDb.getBlogPostById(input.id);
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }
      return post;
    }),
  
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string(),
      content: z.string(),
      author: z.string(),
      category: z.string(),
      image: z.string().optional(),
      readTime: z.string().optional(),
      isPublished: z.boolean().default(true),
      publishedAt: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      const postId = await adminDb.createBlogPost(input);
      return { id: postId };
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      excerpt: z.string().optional(),
      content: z.string().optional(),
      author: z.string().optional(),
      category: z.string().optional(),
      image: z.string().optional(),
      readTime: z.string().optional(),
      isPublished: z.boolean().optional(),
      publishedAt: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDb.updateBlogPost(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDb.deleteBlogPost(input.id);
      return { success: true };
    }),
  
  toggleFeatured: adminProcedure
    .input(z.object({ id: z.number(), featured: z.boolean() }))
    .mutation(async ({ input }) => {
      await adminDb.toggleBlogPostFeatured(input.id, input.featured);
      return { success: true };
    }),
});

export const adminBannersRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDb.getAllHeroBanners();
  }),
  
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      image: z.string(),
      ctaText: z.string().optional(),
      ctaLink: z.string().optional(),
      displayDuration: z.number().default(10),
      showContent: z.boolean().default(true),
      textPosition: z.enum(["left", "center", "right"]).default("left"),
      overlayOpacity: z.number().min(0).max(100).default(50),
      order: z.number().default(0),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      await adminDb.createHeroBanner(input);
      return { success: true };
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      image: z.string().optional(),
      showContent: z.boolean().optional(),
      ctaText: z.string().optional(),
      ctaLink: z.string().optional(),
      displayDuration: z.number().optional(),
      textPosition: z.enum(["left", "center", "right"]).optional(),
      overlayOpacity: z.number().min(0).max(100).optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDb.updateHeroBanner(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDb.deleteHeroBanner(input.id);
      return { success: true };
    }),
  
  reorder: adminProcedure
    .input(z.object({ id: z.number(), newOrder: z.number() }))
    .mutation(async ({ input }) => {
      await adminDb.reorderHeroBanner(input.id, input.newOrder);
      return { success: true };
    }),
});

export const adminCertificationsRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDb.getAllCertifications();
  }),
  
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      image: z.string(),
      order: z.number().default(0),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      await adminDb.createCertification(input);
      return { success: true };
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      image: z.string().optional(),
      order: z.number().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDb.updateCertification(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDb.deleteCertification(input.id);
      return { success: true };
    }),
});

export const adminSettingsRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDb.getAllSettings();
  }),
  
  upsert: adminProcedure
    .input(z.object({
      key: z.string(),
      value: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await adminDb.upsertSetting(input);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      await adminDb.deleteSetting(input.key);
      return { success: true };
    }),
});

import * as adminDbMetadata from "./adminDbMetadata";
import * as adminDbOmbudsman from "./adminDbOmbudsman";

export const adminCategoriesRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDbMetadata.getAllCategories();
  }),
  
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await adminDbMetadata.createCategory(input);
      return { success: true };
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDbMetadata.updateCategory(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDbMetadata.deleteCategory(input.id);
      return { success: true };
    }),
});

export const adminTypesRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDbMetadata.getAllTypes();
  }),
  
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      slug: z.string(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await adminDbMetadata.createType(input);
      return { success: true };
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      slug: z.string().optional(),
      description: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDbMetadata.updateType(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDbMetadata.deleteType(input.id);
      return { success: true };
    }),
});

export const adminPartnersRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDbMetadata.getAllPartnershipRequests();
  }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(['pending', 'in_review', 'approved', 'rejected']).optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDbMetadata.updatePartnershipRequest(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDbMetadata.deletePartnershipRequest(input.id);
      return { success: true };
    }),
});


// Ombudsman Router
export const adminOmbudsmanRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDbOmbudsman.getAllOmbudsmanMessages();
  }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "in_review", "resolved", "closed"]).optional(),
      response: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDbOmbudsman.updateOmbudsmanMessage(id, data);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDbOmbudsman.deleteOmbudsmanMessage(input.id);
      return { success: true };
    }),
});


export const adminTestimonialsRouter = router({
  getAll: adminProcedure.query(async () => {
    return await adminDb.getAllTestimonials();
  }),
  
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const testimonial = await adminDb.getTestimonialById(input.id);
      if (!testimonial) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Testimonial not found" });
      }
      return testimonial;
    }),
  
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      role: z.string(),
      company: z.string(),
      location: z.string().optional(),
      testimonial: z.string(),
      rating: z.number().min(1).max(5).default(5),
      image: z.string().optional(),
      videoUrl: z.string().optional(),
      courseName: z.string().optional(),
      isActive: z.boolean().default(true),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const testimonialId = await adminDb.createTestimonial(input);
      return { id: testimonialId };
    }),
  
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      role: z.string().optional(),
      company: z.string().optional(),
      location: z.string().optional(),
      testimonial: z.string().optional(),
      rating: z.number().min(1).max(5).optional(),
      image: z.string().optional(),
      videoUrl: z.string().optional(),
      courseName: z.string().optional(),
      isActive: z.boolean().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await adminDb.updateTestimonial(id, data);
      return { success: true };
    }),
  
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await adminDb.deleteTestimonial(input.id);
      return { success: true };
    }),
});
