import { fa, faker } from "@faker-js/faker";
import { statuses } from "./data";

export const submissionFaker = Array.from({ length: 100 }, () => ({
  id: `${faker.number.int({ min: 1000, max: 9999 })}`,
  username: faker.person.fullName(),
  status: faker.helpers.arrayElement(statuses).value,
  executionTime: `${faker.number.int({ min: 1000, max: 9999 })}`,
  submissionTime: `${faker.number.int({ min: 1000, max: 9999 })}`,
  backendUrl: faker.internet.url(),
  websocketUrl: faker.internet.url(),
}));
