import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;
async function getDbPool() {
  if (!pool) {
    const dbUrl = process.env.DATABASE_URL || "mysql://faculdade_user:Faculdade2024!@localhost:3306/faculdade_db";
    pool = mysql.createPool({
      uri: dbUrl,
      waitForConnections: true,
      connectionLimit: 5,
    });
  }
  return pool;
}

// ========== ADMIN SELOS (home_certifications) ==========
export const adminSelosRouter = router({
  getAll: publicProcedure.query(async () => {
    const db = await getDbPool();
    const [rows] = await db.query(
      "SELECT id, name as title, image_url as image, link, sort_order as `order`, active as isActive FROM home_certifications ORDER BY sort_order"
    );
    return rows;
  }),

  create: publicProcedure
    .input(z.object({
      title: z.string(),
      image: z.string(),
      link: z.string().optional(),
      isActive: z.boolean().default(true),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query(
        "INSERT INTO home_certifications (name, image_url, link, sort_order, active) VALUES (?, ?, ?, ?, ?)",
        [input.title, input.image, input.link || null, input.order, input.isActive ? 1 : 0]
      );
      return { success: true };
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      image: z.string().optional(),
      link: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query(
        `UPDATE home_certifications 
         SET name = COALESCE(?, name),
             image_url = COALESCE(?, image_url),
             link = COALESCE(?, link),
             sort_order = COALESCE(?, sort_order),
             active = COALESCE(?, active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.title, input.image, input.link, input.order, input.isActive !== undefined ? (input.isActive ? 1 : 0) : null, input.id]
      );
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query("DELETE FROM home_certifications WHERE id = ?", [input.id]);
      return { success: true };
    }),
});

// ========== ADMIN IMPRENSA (home_press) ==========
export const adminImprensaRouter = router({
  getAll: publicProcedure.query(async () => {
    const db = await getDbPool();
    const [rows] = await db.query(
      "SELECT id, name, image_url as logo, link, sort_order as `order`, active as isActive FROM home_press ORDER BY sort_order"
    );
    return rows;
  }),

  create: publicProcedure
    .input(z.object({
      name: z.string(),
      logo: z.string(),
      link: z.string().optional(),
      isActive: z.boolean().default(true),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query(
        "INSERT INTO home_press (name, image_url, link, sort_order, active) VALUES (?, ?, ?, ?, ?)",
        [input.name, input.logo, input.link || null, input.order, input.isActive ? 1 : 0]
      );
      return { success: true };
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      logo: z.string().optional(),
      link: z.string().optional().nullable(),
      isActive: z.boolean().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query(
        `UPDATE home_press 
         SET name = COALESCE(?, name),
             image_url = COALESCE(?, image_url),
             link = COALESCE(?, link),
             sort_order = COALESCE(?, sort_order),
             active = COALESCE(?, active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.name, input.logo, input.link, input.order, input.isActive !== undefined ? (input.isActive ? 1 : 0) : null, input.id]
      );
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query("DELETE FROM home_press WHERE id = ?", [input.id]);
      return { success: true };
    }),
});

// ========== ADMIN DIFERENCIAIS (home_diferenciais) ==========
export const adminDiferenciaisRouter = router({
  getAll: publicProcedure.query(async () => {
    const db = await getDbPool();
    const [rows] = await db.query(
      "SELECT id, title, description, icon, sort_order as `order`, active as isActive FROM home_diferenciais ORDER BY sort_order"
    );
    return rows;
  }),

  create: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      isActive: z.boolean().default(true),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query(
        "INSERT INTO home_diferenciais (title, description, icon, sort_order, active) VALUES (?, ?, ?, ?, ?)",
        [input.title, input.description || null, input.icon || 'DollarSign', input.order, input.isActive ? 1 : 0]
      );
      return { success: true };
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      isActive: z.boolean().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query(
        `UPDATE home_diferenciais 
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             icon = COALESCE(?, icon),
             sort_order = COALESCE(?, sort_order),
             active = COALESCE(?, active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.title, input.description, input.icon, input.order, input.isActive !== undefined ? (input.isActive ? 1 : 0) : null, input.id]
      );
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query("DELETE FROM home_diferenciais WHERE id = ?", [input.id]);
      return { success: true };
    }),
});

// ========== ADMIN SECTION SETTINGS (home_settings) ==========
export const adminSectionSettingsRouter = router({
  getBySection: publicProcedure
    .input(z.object({ section: z.string() }))
    .query(async ({ input }) => {
      const db = await getDbPool();
      const [rows] = await db.query(
        "SELECT id, section, field, value, image_url, sort_order, active FROM home_settings WHERE section = ? ORDER BY sort_order",
        [input.section]
      );
      return rows;
    }),

  upsertField: publicProcedure
    .input(z.object({
      section: z.string(),
      field: z.string(),
      value: z.string().optional().nullable(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      // Check if exists
      const [existing]: any = await db.query(
        "SELECT id FROM home_settings WHERE section = ? AND field = ?",
        [input.section, input.field]
      );
      if (existing.length > 0) {
        await db.query(
          "UPDATE home_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE section = ? AND field = ?",
          [input.value || '', input.section, input.field]
        );
      } else {
        await db.query(
          "INSERT INTO home_settings (section, field, value, sort_order, active) VALUES (?, ?, ?, 0, 1)",
          [input.section, input.field, input.value || '']
        );
      }
      return { success: true };
    }),

  bulkUpdate: publicProcedure
    .input(z.object({
      section: z.string(),
      fields: z.array(z.object({
        field: z.string(),
        value: z.string().optional().nullable(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      for (const f of input.fields) {
        const [existing]: any = await db.query(
          "SELECT id FROM home_settings WHERE section = ? AND field = ?",
          [input.section, f.field]
        );
        if (existing.length > 0) {
          await db.query(
            "UPDATE home_settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE section = ? AND field = ?",
            [f.value || '', input.section, f.field]
          );
        } else {
          await db.query(
            "INSERT INTO home_settings (section, field, value, sort_order, active) VALUES (?, ?, ?, 0, 1)",
            [input.section, f.field, f.value || '']
          );
        }
      }
      return { success: true };
    }),
});

// ========== ADMIN PLATFORM FEATURES (home_platform_features) ==========
export const adminPlatformFeaturesRouter = router({
  getAll: publicProcedure.query(async () => {
    const db = await getDbPool();
    const [rows] = await db.query(
      "SELECT id, title, description, icon, sort_order as `order`, active as isActive FROM home_platform_features ORDER BY sort_order"
    );
    return rows;
  }),

  create: publicProcedure
    .input(z.object({
      title: z.string(),
      description: z.string().optional(),
      icon: z.string().optional(),
      isActive: z.boolean().default(true),
      order: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query(
        "INSERT INTO home_platform_features (title, description, icon, sort_order, active) VALUES (?, ?, ?, ?, ?)",
        [input.title, input.description || null, input.icon || 'Check', input.order, input.isActive ? 1 : 0]
      );
      return { success: true };
    }),

  update: publicProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      icon: z.string().optional(),
      isActive: z.boolean().optional(),
      order: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query(
        `UPDATE home_platform_features 
         SET title = COALESCE(?, title),
             description = COALESCE(?, description),
             icon = COALESCE(?, icon),
             sort_order = COALESCE(?, sort_order),
             active = COALESCE(?, active),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [input.title, input.description, input.icon, input.order, input.isActive !== undefined ? (input.isActive ? 1 : 0) : null, input.id]
      );
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDbPool();
      await db.query("DELETE FROM home_platform_features WHERE id = ?", [input.id]);
      return { success: true };
    }),
});
