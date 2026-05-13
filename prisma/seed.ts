import { PrismaClient } from '@prisma/client';
import { LESSONS } from '../src/data/reactLessons';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Group lessons by topic prefix
  const topics: Record<string, any[]> = {};
  
  LESSONS.forEach((lesson) => {
    const topicName = lesson.title.includes(':') ? lesson.title.split(':')[0] : 'General';
    if (!topics[topicName]) topics[topicName] = [];
    topics[topicName].push(lesson);
  });

  for (const [topicName, lessons] of Object.entries(topics)) {
    console.log(`Creating Topic: ${topicName} with ${lessons.length} lessons...`);
    
    const slug = topicName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '');
    
    const topic = await prisma.topic.upsert({
      where: { slug: `react-${slug}` },
      update: {
        name: topicName,
        category: "React",
        engine: "REACT",
      },
      create: {
        name: topicName,
        slug: `react-${slug}`,
        category: "React",
        engine: "REACT",
        description: `Learn everything about ${topicName} in React.`,
      },
    });

    for (let i = 0; i < lessons.length; i++) {
      const lessonData = lessons[i];
      await prisma.lesson.upsert({
        where: { 
          topicId_order: {
            topicId: topic.id,
            order: i
          }
        },
        update: {
          title: lessonData.title,
          concept: lessonData.concept,
          exampleCode: lessonData.exampleCode,
          exerciseDescription: lessonData.exerciseDescription,
          starterCode: lessonData.starterCode,
          solution: lessonData.solution,
          test: lessonData.test.toString(), // Store as string
        },
        create: {
          topicId: topic.id,
          order: i,
          title: lessonData.title,
          concept: lessonData.concept,
          exampleCode: lessonData.exampleCode,
          exerciseDescription: lessonData.exerciseDescription,
          starterCode: lessonData.starterCode,
          solution: lessonData.solution,
          test: lessonData.test.toString(),
        },
      });
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
