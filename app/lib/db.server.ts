import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
    await prisma.$connect();

    prisma
})();

export default prisma;
