import { PrismaClient } from "@prisma/client";
import { fa, faker } from "@faker-js/faker";

export const statuses = [
  {
    value: "in progress",
    label: "in progress",
  },
  {
    value: "done",
    label: "done",
  },
  {
    value: "failed",
    label: "failed",
  },
];
const prisma = new PrismaClient();
export const submissionFaker = Array.from({ length: 50 }, () => ({
  username: faker.person.fullName(),
  status: faker.helpers.arrayElement(statuses).value,
  executionTime: `${faker.number.int({ min: 1000, max: 9999 })}`,
  submissionTime: `${faker.number.int({ min: 1000, max: 9999 })}`,
  backendUrl: faker.internet.url(),
  websocketUrl: faker.internet.url(),
}));

export const challengesFaker = Array.from({ length: 5 }, () => ({
  name: faker.person.fullName(),
  isActive: faker.helpers.arrayElement([true, false]),
  image: faker.helpers.arrayElement([
    "https://media.licdn.com/dms/image/D4D12AQH8yhtEC2rZEA/article-cover_image-shrink_600_2000/0/1694917502257?e=2147483647&v=beta&t=Oq7vPy3oOKjdXA0KZjtDHcDCwa45WssCNqmAFfA4rgY",
    "https://www.yuvamanthan.org/hackathon.jpg",
    "https://tradersunion.com/uploads/articles/212/img-2.svg",
    "https://miro.medium.com/v2/resize:fit:1400/1*NE3NxEPclu2bbvoi8YkEEg.png",
  ]),
  notionDocPageId: "11b7dfd107358007a956eeec206106fc",
}));

async function seedSubmissions() {
  try {
    //    await prisma.submission.createMany({
    //      data: submissionFaker,
    //    });

    await prisma.challenge.createMany({
      data: challengesFaker,
    });
    console.log("✅ Submisson seed completed");
    console.log("✅ Challenges seed completed");
  } catch (error) {
    console.error("Error seeding Submissions:", error);
  }
}

async function main() {
  await seedSubmissions();
}

main();
