import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDbPool } from "./_core/index";

export const homeRouters = router({
  // ========== HOME SETTINGS ==========
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
        "SELECT * FROM ecosystem_institutions ORDER BY display_order"
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
          "SELECT id FROM home_settings WHERE section = ? AND field_key = ?",
          [input.section, field.key]
        );

        if ((existing as any[]).length > 0) {
          await pool.query(
            `UPDATE home_settings 
             SET field_value = ?, updated_at = CURRENT_TIMESTAMP
             WHERE section = ? AND field_key = ?`,
            [field.value, input.section, field.key]
          );
        } else {
          await pool.query(
            `INSERT INTO home_settings (section, field_key, field_value) 
             VALUES (?, ?, ?)`,
            [input.section, field.key, field.value]
          );
        }
      }

      return { success: true };
    }),
});
