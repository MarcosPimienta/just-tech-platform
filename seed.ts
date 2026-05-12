import { prisma } from "./prisma/db";
import { LESSONS } from "./src/data/reactLessons";

async function main() {
  const topic = await prisma.topic.upsert({
    where: { slug: "react" },
    update: {},
    create: {
      name: "React Bolt",
      slug: "react",
      description: "Learn React state and inputs by doing short, interactive exercises.",
    },
  });

  for (let i = 0; i < LESSONS.length; i++) {
    const l = LESSONS[i];
    await prisma.lesson.upsert({
      where: {
        topicId_order: {
          topicId: topic.id,
          order: i,
        },
      },
      update: {
        id: l.id,
        title: l.title,
        concept: l.concept,
        exampleCode: l.exampleCode,
        exerciseDescription: l.exerciseDescription,
        starterCode: l.starterCode,
        solution: l.solution,
        test: l.test ? l.test.toString() : "",
      },
      create: {
        id: l.id,
        topicId: topic.id,
        order: i,
        title: l.title,
        concept: l.concept,
        exampleCode: l.exampleCode,
        exerciseDescription: l.exerciseDescription,
        starterCode: l.starterCode,
        solution: l.solution,
        test: l.test ? l.test.toString() : "",
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
