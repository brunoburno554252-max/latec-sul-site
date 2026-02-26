import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  adminAuthRouter,
  adminCoursesRouter,
  adminCurriculumRouter,
  adminBlogRouter,
  adminBannersRouter,
  adminCertificationsRouter,
  adminSettingsRouter,
  adminCategoriesRouter,
  adminTypesRouter,
  adminPartnersRouter,
  adminOmbudsmanRouter,
  adminTestimonialsRouter,
  adminAboutRouter,
} from "./adminRouters";
import {
  publicCoursesRouter,
  publicBlogRouter,
  publicBannersRouter,
  publicCertificationsRouter,
  publicSettingsRouter,
  publicCategoriesRouter,
  publicTypesRouter,
  publicTestimonialsRouter, publicAboutRouter,
} from "./publicRouters";
import { publicPartnersRouter } from "./publicPartnersRouter";
import { publicOmbudsmanRouter } from "./publicOmbudsmanRouter";
import { uploadRouter } from "./uploadRouter";
import { licenciadosProxyRouter } from "./licenciadosProxy";
import { analyticsRouter } from "./analyticsRouter";
import { ecosystemRouter } from "./ecosystemRouter";
import { bitrixCertificadosRouter } from "./bitrixCertificadosRouter";
import { homeRouters } from "./homeRouters";
import { adminSelosRouter, adminImprensaRouter, adminDiferenciaisRouter, adminSectionSettingsRouter, adminPlatformFeaturesRouter } from "./adminHomeExtras";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Public routers (no auth required)
  courses: publicCoursesRouter,
  blog: publicBlogRouter,
  banners: publicBannersRouter,
  certifications: publicCertificationsRouter,
  settings: publicSettingsRouter,
  categories: publicCategoriesRouter,
  types: publicTypesRouter,
  testimonials: publicTestimonialsRouter, about: publicAboutRouter,
  partners: publicPartnersRouter,
  ombudsman: publicOmbudsmanRouter,
  licenciados: licenciadosProxyRouter,
  upload: uploadRouter,
  analytics: analyticsRouter,
  ecosystem: ecosystemRouter,
  bitrixCertificados: bitrixCertificadosRouter,
  home: homeRouters,

  // Admin routers
  adminAuth: adminAuthRouter,
  adminCourses: adminCoursesRouter,
  adminCurriculum: adminCurriculumRouter,
  adminBlog: adminBlogRouter,
  adminBanners: adminBannersRouter,
  adminCertifications: adminCertificationsRouter,
  adminSettings: adminSettingsRouter,
  adminCategories: adminCategoriesRouter,
  adminTypes: adminTypesRouter,
  adminPartners: adminPartnersRouter,
  adminOmbudsman: adminOmbudsmanRouter,
  adminTestimonials: adminTestimonialsRouter,
  adminHome: homeRouters,
  adminSelos: adminSelosRouter,
  adminImprensa: adminImprensaRouter,
  adminDiferenciais: adminDiferenciaisRouter,
  adminSectionSettings: adminSectionSettingsRouter,
  adminPlatformFeatures: adminPlatformFeaturesRouter,
  adminAbout: adminAboutRouter,
});

export type AppRouter = typeof appRouter;
