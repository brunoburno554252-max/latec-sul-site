import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

// Usar __dirname equivalente em ES modules
const CARDS_FILE = join(process.cwd(), "client/src/data/organograma-cards-final.json");

const cardCoordinateSchema = z.object({
  cardId: z.string(),
  nome: z.string(),
  tipo: z.string(),
  categoria: z.string(),
  posicao: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  descricao: z.string(),
  inverted: z.boolean().optional(),
});

type CardCoordinate = z.infer<typeof cardCoordinateSchema>;

export const ecosystemRouter = router({
  // Salvar coordenadas dos cards direto no arquivo JSON
  saveCoordinates: publicProcedure
    .input(z.record(z.string(), cardCoordinateSchema))
    .mutation(({ input }) => {
      try {
        console.log("[Ecosystem] Salvando coordenadas no arquivo JSON...");
        console.log("[Ecosystem] Caminho do arquivo:", CARDS_FILE);
        
        // Salvar direto no arquivo JSON
        const jsonContent = JSON.stringify(input, null, 2);
        writeFileSync(CARDS_FILE, jsonContent, "utf-8");
        
        console.log("[Ecosystem] Coordenadas salvas com sucesso!");

        return {
          success: true,
          message: "Coordenadas salvas com sucesso!",
        };
      } catch (error) {
        console.error("[Ecosystem] Erro ao salvar coordenadas:", error);
        throw new Error(`Erro ao salvar coordenadas: ${error instanceof Error ? error.message : String(error)}`);
      }
    }),

  // Carregar coordenadas do arquivo JSON
  getCoordinates: publicProcedure.query(() => {
    try {
      console.log("[Ecosystem] Carregando coordenadas do arquivo JSON...");
      const fileContent = readFileSync(CARDS_FILE, "utf-8");
      const coordinates = JSON.parse(fileContent);
      console.log("[Ecosystem] Coordenadas carregadas com sucesso!");
      return coordinates;
    } catch (error) {
      console.error("[Ecosystem] Erro ao carregar coordenadas:", error);
      throw new Error(`Erro ao carregar coordenadas: ${error instanceof Error ? error.message : String(error)}`);
    }
  }),

  // Inverter estado de um card (branco/rosa)
  toggleInverted: publicProcedure
    .input(z.object({
      cardId: z.string(),
      inverted: z.boolean(),
    }))
    .mutation(({ input }) => {
      try {
        console.log(`[Ecosystem] Invertendo card ${input.cardId}...`);
        
        // Ler arquivo atual
        const fileContent = readFileSync(CARDS_FILE, "utf-8");
        const coordinates = JSON.parse(fileContent);
        
        // Atualizar o card específico
        if (coordinates[input.cardId]) {
          coordinates[input.cardId].inverted = input.inverted;
        }
        
        // Salvar arquivo atualizado
        const jsonContent = JSON.stringify(coordinates, null, 2);
        writeFileSync(CARDS_FILE, jsonContent, "utf-8");
        
        console.log(`[Ecosystem] Card ${input.cardId} invertido com sucesso!`);

        return {
          success: true,
          message: `Card ${input.cardId} invertido com sucesso!`,
        };
      } catch (error) {
        console.error("[Ecosystem] Erro ao inverter card:", error);
        throw new Error(`Erro ao inverter card: ${error instanceof Error ? error.message : String(error)}`);
      }
    }),
});
