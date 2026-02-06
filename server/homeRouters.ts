import { z } from "zod";
import { publicProcedure, router } from "./_core/trpc";
import { getDbPool } from "./_core/index";

export const homeRouters = router({
  // Buscar todas as configurações da home
  getHomeSettings: publicProcedure
    .query(async () => {
      const pool = await getDbPool();
      const [rows] = await pool.query(
        "SELECT * FROM home_settings WHERE active = TRUE ORDER BY section, sort_order"
      );
      return rows;
    }),

  // Buscar configurações de uma seção específica
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

  // Atualizar um campo específico
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
      
      // Verificar se o registro já existe
      const [existing] = await pool.query(
        "SELECT id FROM home_settings WHERE section = ? AND field = ?",
        [input.section, input.field]
      );

      if ((existing as any[]).length > 0) {
        // Atualizar registro existente
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
        // Inserir novo registro
        await pool.query(
          `INSERT INTO home_settings (section, field, value, image_url, sort_order)
           VALUES (?, ?, ?, ?, ?)`,
          [input.section, input.field, input.value, input.imageUrl, input.sortOrder || 0]
        );
      }

      return { success: true };
    }),

  // Atualizar múltiplos campos de uma vez
  updateHomeSection: publicProcedure
    .input(z.object({
      section: z.string(),
      fields: z.array(z.object({
        field: z.string(),
        value: z.string().optional(),
        imageUrl: z.string().optional(),
        sortOrder: z.number().optional()
      }))
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      
      for (const fieldData of input.fields) {
        const [existing] = await pool.query(
          "SELECT id FROM home_settings WHERE section = ? AND field = ?",
          [input.section, fieldData.field]
        );

        if ((existing as any[]).length > 0) {
          await pool.query(
            `UPDATE home_settings 
             SET value = COALESCE(?, value), 
                 image_url = COALESCE(?, image_url),
                 sort_order = COALESCE(?, sort_order),
                 updated_at = CURRENT_TIMESTAMP
             WHERE section = ? AND field = ?`,
            [fieldData.value, fieldData.imageUrl, fieldData.sortOrder, input.section, fieldData.field]
          );
        } else {
          await pool.query(
            `INSERT INTO home_settings (section, field, value, image_url, sort_order)
             VALUES (?, ?, ?, ?, ?)`,
            [input.section, fieldData.field, fieldData.value, fieldData.imageUrl, fieldData.sortOrder || 0]
          );
        }
      }

      return { success: true };
    }),

  // Deletar um campo
  deleteHomeField: publicProcedure
    .input(z.object({
      section: z.string(),
      field: z.string()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        "DELETE FROM home_settings WHERE section = ? AND field = ?",
        [input.section, input.field]
      );
      return { success: true };
    }),

  // Ativar/desativar uma seção
  toggleHomeSection: publicProcedure
    .input(z.object({
      section: z.string(),
      active: z.boolean()
    }))
    .mutation(async ({ input }) => {
      const pool = await getDbPool();
      await pool.query(
        "UPDATE home_settings SET active = ? WHERE section = ?",
        [input.active, input.section]
      );
      return { success: true };
    })
});
