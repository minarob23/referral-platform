import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.job.createMany({
    data: [
      {
        title: "Senior Frontend Engineer",
        location: "San Francisco, CA",
        description: "We're looking for a skilled Frontend Engineer to join our product team. You'll be building responsive, performant React applications with TypeScript and collaborating closely with design and backend teams."
      },
      {
        title: "Data Analyst",
        location: "New York, NY",
        description: "Join our data team to analyze large datasets, build dashboards, and provide actionable insights. Proficiency in SQL, Python, and visualization tools like Tableau or Power BI is required."
      },
      {
        title: "DevOps Engineer",
        location: "Remote",
        description: "We need a DevOps Engineer experienced in CI/CD pipelines, Kubernetes, Docker, and cloud platforms (AWS/GCP). You'll improve our deployment processes and infrastructure reliability."
      },
      {
        title: "Product Manager",
        location: "Austin, TX",
        description: "Lead cross-functional teams to define, build, and launch products. You'll own the product roadmap, work with stakeholders, and translate user needs into actionable requirements."
      },
      {
        title: "Backend Engineer (Node.js)",
        location: "London, UK",
        description: "Build and scale our RESTful APIs and microservices using Node.js and TypeScript. Experience with PostgreSQL, Redis, and message queues is a plus."
      }
    ],
    skipDuplicates: true,
  });
  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

