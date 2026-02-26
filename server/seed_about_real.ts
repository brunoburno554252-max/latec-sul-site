import { getDb } from "./db";
import { aboutHero, aboutTimeline, aboutUnits, aboutFooterQuote } from "../drizzle/schema";
import { eq } from "drizzle-orm";

async function seed() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  console.log("Seeding REAL About Us content from Canva...");

  // 1. Hero Section
  const existingHero = await db.select().from(aboutHero).limit(1);
  const heroData = {
    title: "Sobre a LA Educação",
    description: "E se cada matrícula fosse uma semente de futuro, e também o motor do seu crescimento? A LA Educação nasceu para te colocar no centro dessa história: conectamos instituições de ensino a parceiros de pequeno porte e promovendo maior equilíbrio competitivo frente aos grandes grupos do setor.",
    imageUrl: "/sede_la_educacao.webp",
    badgeText: "Nossa Sede",
    badgeValue: "+1000 m²"
  };

  if (existingHero.length > 0) {
    await db.update(aboutHero).set(heroData).where(eq(aboutHero.id, existingHero[0].id));
  } else {
    await db.insert(aboutHero).values(heroData);
  }

  // 2. Timeline
  const timelineItems = [
    {
      year: "2020 - 2021",
      title: "A ideia ganha forma",
      description: "Durante a pandemia, o ideal de fortalecer, empoderar e educar o Brasil de forma que busca oferecer ensino acessível, de qualidade e com impacto humanitário.",
      tag: "Idealização",
      orderIndex: 1,
      imageUrl: "/sede_la_educacao.webp"
    },
    {
      year: "2023",
      title: "Nasce oficialmente a LA Educação",
      description: "A empresa estabelece o primeiro escritório na cidade de Maringá-PR. Com muita coragem e trabalho intenso, iniciou-se a construção de um grande sonho educacional.",
      tag: "Surgimento",
      orderIndex: 2,
      imageUrl: "/sede_la_educacao.webp"
    },
    {
      year: "2023",
      title: "Crescimento Exponencial",
      description: "Logo no primeiro ano, a LA Educação expande sua rede de representantes em todo o país, conectando mais de 100 instituições de ensino e criando um portfólio com mais de 500 cursos.",
      tag: "Expansão",
      orderIndex: 3,
      imageUrl: "/sede_la_educacao.webp"
    },
    {
      year: "2024",
      title: "Passo Estratégico",
      description: "Aquisição de um novo prédio e início do processo de credenciamento da primeira Escola Técnica do Grupo, a LA TEC-PR, consolidando a expansão institucional.",
      tag: "Estrutura",
      orderIndex: 4,
      imageUrl: "/sede_la_educacao.webp"
    },
    {
      year: "2024",
      title: "Consolidação da Marca",
      description: "Processo de rebranding e aquisição do Instituto Átila, ampliando o ecossistema educacional e o suporte técnico aos parceiros.",
      tag: "A Marca",
      orderIndex: 5,
      imageUrl: "/sede_la_educacao.webp"
    },
    {
      year: "2024",
      title: "Grupo Educacional",
      description: "Atualmente, o Grupo LA Educação conta com uma estrutura sólida de 4 andares em Maringá-PR, com mais de 1000 m² de área construída.",
      tag: "Destaque",
      orderIndex: 6,
      imageUrl: "/sede_la_educacao.webp"
    },
    {
      year: "2025",
      title: "O crescimento não para",
      description: "Inauguração da segunda sede administrativa em Curitiba-PR, ampliando a capacidade de atendimento e focando na inovação tecnológica e operacional.",
      tag: "Futuro",
      orderIndex: 7,
      imageUrl: "/sede_la_educacao.webp"
    }
  ];

  await db.delete(aboutTimeline);
  for (const item of timelineItems) {
    await db.insert(aboutTimeline).values(item);
  }

  // 3. Units
  const units = [
    { name: "Sede Administrativa I", imageUrl: "/sede_la_educacao.webp", orderIndex: 1 },
    { name: "Escola Técnica LA TEC-PR", imageUrl: "/sede_la_educacao.webp", orderIndex: 2 },
    { name: "Unidade Administrativa II", imageUrl: "/sede_la_educacao.webp", orderIndex: 3 },
    { name: "Escola Técnica LA TEC-PR (Fachada)", imageUrl: "/sede_la_educacao.webp", orderIndex: 4 },
    { name: "Unidade Administrativa II (Fachada)", imageUrl: "/sede_la_educacao.webp", orderIndex: 5 }
  ];

  await db.delete(aboutUnits);
  for (const unit of units) {
    await db.insert(aboutUnits).values(unit);
  }

  // 4. Footer Quote
  const existingQuote = await db.select().from(aboutFooterQuote).limit(1);
  const quoteData = {
    quote: "Acreditamos que a educação é a ferramenta mais poderosa para transformar vidas e realidades.",
    author: "Fredison Carneiro",
    authorRole: "Fundador do Grupo LA Educação"
  };

  if (existingQuote.length > 0) {
    await db.update(aboutFooterQuote).set(quoteData).where(eq(aboutFooterQuote.id, existingQuote[0].id));
  } else {
    await db.insert(aboutFooterQuote).values(quoteData);
  }

  console.log("REAL Seed completed successfully!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
