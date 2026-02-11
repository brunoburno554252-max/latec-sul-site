import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDbPool } from "./_core/index";

export const homeRouters = router({
  // ========== HOME SETTINGS ==========
  getSettings: publicProcedure.query(async () => {
    const pool = await getDbPool();
    const [rows] = await pool.query(
      "SELECT * FROM home_settings WHERE active = TRUE ORDER BY section, sort_order"
    );
    return rows;
  }),
  getHomeSettings: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        "SELECT * FROM home_settings WHERE active = TRUE ORDER BY section, sort_order"
      );
      return rows;
    }),

  getHomeSection: publicProcedure
    .input(z.object({ section: z.string() }))
    .query(async ({ input }) => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        "SELECT * FROM home_settings WHERE section = ? AND active = TRUE ORDER BY sort_order",
        [input.section]
      );
      return rows;
    }),

  updateHomeField: publicProcedure
    .input(z.object({
      section: z.string(),
      field: z.string(),
      value: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      
      const [existing] = await pool.query(
        "SELECT id FROM home_settings WHERE section = ? AND field = ?",
        [input.section, input.field]
      );

      if ((existing as any[]).length > 0) {
        await pool.query(
          `UPDATE home_settings 
           SET value = COALESCE(?, value), 
               image_url = COALESCE(?, image_url),
               sort_order = COALESCE(?, sort_order),
               updated_at = CURRENT_TIMESTAMP
           WHERE section = ? AND field = ?`,
          [input.value, input.imageUrl, input.sortOrder, input.section, input.field]
        );
      } else {
        await pool.query(
          `INSERT INTO home_settings (section, field, value, image_url, sort_order) 
           VALUES (?, ?, ?, ?, ?)`,
          [input.section, input.field, input.value, input.imageUrl, input.sortOrder || 0]
        );
      }

      return { success: true };
    }),

  // ========== CERTIFICATIONS (SELOS) ==========
  getCertifications: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        "SELECT * FROM home_certifications WHERE active = TRUE ORDER BY sort_order"
      );
      return rows;
    }),

  addCertification: publicProcedure
    .input(z.object({
      name: z.string(),
      imageUrl: z.string(),
      link: z.string().optional(),
      sortOrder: z.number().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        "INSERT INTO home_certifications (name, image_url, link, sort_order) VALUES (?, ?, ?, ?)",
        [input.name, input.imageUrl, input.link || null, input.sortOrder || 0]
      );
      return { success: true };
    }),

  updateCertification: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      imageUrl: z.string().optional(),
      link: z.string().optional(),
      sortOrder: z.number().optional(),
      active: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        `UPDATE home_certifications 
         SET name = COALESCE(?, name),
             image_url = COALESCE(?, image_url),
             link = COALESCE(?, link),
             sort_order = COALESCE(?, sort_order),
             active = COALESCE(?, active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.name, input.imageUrl, input.link, input.sortOrder, input.active, input.id]
      );
      return { success: true };
    }),

  deleteCertification: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query("DELETE FROM home_certifications WHERE id = ?", [input.id]);
      return { success: true };
    }),

  // ========== PRESS (IMPRENSA) ==========
  getPress: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        "SELECT * FROM home_press WHERE active = TRUE ORDER BY sort_order"
      );
      return rows;
    }),

  addPress: publicProcedure
    .input(z.object({
      name: z.string(),
      imageUrl: z.string(),
      link: z.string().optional(),
      sortOrder: z.number().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        "INSERT INTO home_press (name, image_url, link, sort_order) VALUES (?, ?, ?, ?)",
        [input.name, input.imageUrl, input.link || null, input.sortOrder || 0]
      );
      return { success: true };
    }),

  updatePress: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      imageUrl: z.string().optional(),
      link: z.string().optional(),
      sortOrder: z.number().optional(),
      active: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        `UPDATE home_press 
         SET name = COALESCE(?, name),
             image_url = COALESCE(?, image_url),
             link = COALESCE(?, link),
             sort_order = COALESCE(?, sort_order),
             active = COALESCE(?, active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.name, input.imageUrl, input.link, input.sortOrder, input.active, input.id]
      );
      return { success: true };
    }),

  deletePress: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query("DELETE FROM home_press WHERE id = ?", [input.id]);
      return { success: true };
    }),

  // ========== HEADER ==========
  getHeader: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query("SELECT * FROM home_header");
      return rows;
    }),

  updateHeader: publicProcedure
    .input(z.object({
      field: z.string(),
      value: z.string()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      
      const [existing] = await pool.query(
        "SELECT id FROM home_header WHERE field = ?",
        [input.field]
      );

      if ((existing as any[]).length > 0) {
        await pool.query(
          "UPDATE home_header SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE field = ?",
          [input.value, input.field]
        );
      } else {
        await pool.query(
          "INSERT INTO home_header (field, value) VALUES (?, ?)",
          [input.field, input.value]
        );
      }

      return { success: true };
    }),

  // ========== FEATURED COURSES ==========
  getFeaturedCourses: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        `SELECT hfc.*, c.name, c.description, c.image_url, c.category_id
         FROM home_featured_courses hfc
         JOIN courses c ON hfc.course_id = c.id
         WHERE hfc.active = TRUE
         ORDER BY hfc.sort_order
         LIMIT 4`
      );
      return rows;
    }),

  addFeaturedCourse: publicProcedure
    .input(z.object({
      courseId: z.number(),
      sortOrder: z.number().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        "INSERT INTO home_featured_courses (course_id, sort_order) VALUES (?, ?)",
        [input.courseId, input.sortOrder || 0]
      );
      return { success: true };
    }),

  removeFeaturedCourse: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query("DELETE FROM home_featured_courses WHERE id = ?", [input.id]);
      return { success: true };
    }),

  // ========== ECOSYSTEM INSTITUTIONS ==========
  getEcosystemInstitutions: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        "SELECT id, name, description, logo_url as logo, banner_url as banner, tipo, categoria, website, missao, visao, valores, pos_x, pos_y, pos_width, pos_height, created_at, updated_at FROM ecosystem_institutions ORDER BY name"
      );
      return rows;
    }),

  // ========== UPDATE HOME SECTION (BATCH) ==========
  updateHomeSection: publicProcedure
    .input(z.object({
      section: z.string(),
      fields: z.array(z.object({
        key: z.string(),
        value: z.string()
      }))
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      
      for (const field of input.fields) {
        const [existing] = await pool.query(
          "SELECT id FROM home_settings WHERE section = ? AND field = ?",
          [input.section, field.key]
        );

        if ((existing as any[]).length > 0) {
          await pool.query(
            `UPDATE home_settings 
             SET value = ?, updated_at = CURRENT_TIMESTAMP
             WHERE section = ? AND field = ?`,
            [field.value, input.section, field.key]
          );
        } else {
          await pool.query(
            `INSERT INTO home_settings (section, field, value) 
             VALUES (?, ?, ?)`,
            [input.section, field.key, field.value]
          );
        }
      }

      return { success: true };
    }),

  // ========== DIFERENCIAIS ==========
  getDiferenciais: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        "SELECT * FROM home_diferenciais WHERE active = TRUE ORDER BY sort_order"
      );
      return rows;
    }),

  addDiferencial: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        "INSERT INTO home_diferenciais (title, description, icon, sort_order) VALUES (?, ?, ?, ?)",
        [input.title, input.description || '', input.icon || 'DollarSign', input.sortOrder || 0]
      );
      return { success: true };
    }),

  updateDiferencial: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
      active: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        `UPDATE home_diferenciais 
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             icon = COALESCE(?, icon),
             sort_order = COALESCE(?, sort_order),
             active = COALESCE(?, active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.title, input.description, input.icon, input.sortOrder, input.active, input.id]
      );
      return { success: true };
    }),

  deleteDiferencial: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query("DELETE FROM home_diferenciais WHERE id = ?", [input.id]);
      return { success: true };
    }),

  // ========== PLATFORM FEATURES ==========
  getPlatformFeatures: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        "SELECT * FROM home_platform_features WHERE active = TRUE ORDER BY sort_order"
      );
      return rows;
    }),

  addPlatformFeature: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        "INSERT INTO home_platform_features (title, description, icon, sort_order) VALUES (?, ?, ?, ?)",
        [input.title, input.description || '', input.icon || 'Check', input.sortOrder || 0]
      );
      return { success: true };
    }),

  updatePlatformFeature: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      sortOrder: z.number().optional(),
      active: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        `UPDATE home_platform_features 
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             icon = COALESCE(?, icon),
             sort_order = COALESCE(?, sort_order),
             active = COALESCE(?, active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.title, input.description, input.icon, input.sortOrder, input.active, input.id]
      );
      return { success: true };
    }),

  deletePlatformFeature: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query("DELETE FROM home_platform_features WHERE id = ?", [input.id]);
      return { success: true };
    }),

  // ========== ECOSYSTEM INSTITUTIONS CRUD ==========
  addEcosystemInstitution: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      logo: z.string(),
      description: z.string().optional(),
      website: z.string().optional(),
      tipo: z.string().optional(),
      categoria: z.string().optional(),
      banner: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        "INSERT INTO ecosystem_institutions (id, name, logo_url, description, website, tipo, categoria, banner_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [input.id, input.name, input.logo, input.description || '', input.website || '', input.tipo || '', input.categoria || '', input.banner || '']
      );
      return { success: true };
    }),

  updateEcosystemInstitution: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      logo: z.string().optional(),
      description: z.string().optional(),
      website: z.string().optional(),
      tipo: z.string().optional(),
      categoria: z.string().optional(),
      banner: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        `UPDATE ecosystem_institutions 
         SET name = COALESCE(?, name),
             logo_url = COALESCE(?, logo_url),
             description = COALESCE(?, description),
             website = COALESCE(?, website),
             tipo = COALESCE(?, tipo),
             categoria = COALESCE(?, categoria),
             banner_url = COALESCE(?, banner_url),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.name, input.logo, input.description, input.website, input.tipo, input.categoria, input.banner, input.id]
      );
      return { success: true };
    }),

  deleteEcosystemInstitution: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query("DELETE FROM ecosystem_institutions WHERE id = ?", [input.id]);
      return { success: true };
    }),
});
