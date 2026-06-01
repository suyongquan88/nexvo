import { execSync } from "node:child_process";

const TEST_DATABASE_URL = "file:./data/nexvo-test.db";

export default function globalSetup() {
  process.env.DATABASE_URL = TEST_DATABASE_URL;
  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
  });
}
