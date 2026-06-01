import { PrismaClient } from "@prisma/client";

//これをどこからでも使いまわす
const prisma = new PrismaClient();

export default prisma
