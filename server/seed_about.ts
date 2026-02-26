import { getDb } from "./db";
import { aboutHero, aboutTimeline, aboutUnits, aboutFooterQuote } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("Seeding About Us content...");

  // 1. Hero Section
  const existingHero = await db.select().from(aboutHero).limit(1);
  const heroData = {
    title: "Nossa História e Compromisso com a Educação",
    description: "O Grupo LA Educação nasceu com o propósito de transformar vidas através do conhecimento. Com anos de experiência no setor educacional, consolidamos nossa presença como referência em qualidade e inovação, oferecendo cursos que preparam nossos alunos para os desafios do mercado de trabalho real.",
    imageUrl: "/images/about/hero-sede.jpg",
    badgeText: "Nossa Sede",
    badgeValue: "+1000 m²"
  };

  if (existingHero.length > 0) {
    await db.update(aboutHero).set(heroData).where(eq(aboutHero.id, existingHero[0].id));
    console.log("Hero updated.");
  } else {
    await db.insert(aboutHero).values(heroData);
    console.log("Hero inserted.");
  }

  // 2. Timeline
  const timelineItems = [
    { year: "2015", title: "Fundação", description: "Início das atividades com foco em cursos técnicos e profissionalizantes.", tag: "Início", orderIndex: 1 },
    { year: "2018", title: "Expansão Regional", description: "Abertura de novas unidades no interior do estado, ampliando nosso alcance.", tag: "Crescimento", orderIndex: 2 },
    { year: "2021", title: "Plataforma Digital", description: "Lançamento da nossa plataforma de ensino a distância com tecnologia de ponta.", tag: "Inovação", orderIndex: 3 },
    { year: "2024", title: "Reconhecimento Nacional", description: "Consolidação como um dos maiores grupos educacionais da região, com milhares de alunos formados.", tag: "Sucesso", orderIndex: 4 }
  ];

  // Clear existing timeline
  await db.delete(aboutTimeline);
  for (const item of timelineItems) {
    await db.insert(aboutTimeline).values(item);
  }
  console.log("Timeline seeded.");

  // 3. Units
  const units = [
    { name: "Unidade Central - São Paulo", imageUrl: "/images/about/unidade-sp.jpg", orderIndex: 1 },
    { name: "Unidade Sul - Curitiba", imageUrl: "/images/about/unidade-curitiba.jpg", orderIndex: 2 },
    { name: "Polo Digital - Remoto", imageUrl: "/images/about/unidade-digital.jpg", orderIndex: 3 }
  ];

  await db.delete(aboutUnits);
  for (const unit of units) {
    await db.insert(aboutUnits).values(unit);
  }
  console.log("Units seeded.");

  // 4. Footer Quote
  const existingQuote = await db.select().from(aboutFooterQuote).limit(1);
  const quoteData = {
    quote: "A educação não transforma o mundo. A educação muda as pessoas. Pessoas transformam o mundo.",
    author: "Paulo Freire",
    authorRole: "Patrono da Educação Brasileira"
  };

  if (existingQuote.length > 0) {
    await db.update(aboutFooterQuote).set(quoteData).where(eq(aboutFooterQuote.id, existingQuote[0].id));
    console.log("Quote updated.");
  } else {
    await db.insert(aboutFooterQuote).values(quoteData);
    console.log("Quote inserted.");
  }

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
