import { config } from "dotenv";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

config({ path: ".env", override: true });
config({ path: ".env.test", override: true });

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

const schema = randomUUID();

beforeAll(async () => {
  const databaseURL = generateDatabaseURL(schema);

  process.env.DATABASE_URL = databaseURL;

  execSync("npx prisma migrate deploy");
});

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await prisma.$disconnect();
});
