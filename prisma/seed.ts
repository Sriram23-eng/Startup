import { PrismaClient } from "@prisma/client";
import { projects, courses } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      create: p,
      update: p,
    });
  }
  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    });
  }
  console.log(
    `Seeded ${projects.length} projects and ${courses.length} courses.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
