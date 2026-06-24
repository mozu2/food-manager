import { userInfo } from "node:os";
import { jwt } from "zod/v4";

export async function register(email: string, password: string) {

    await userInfo = prisma.user.findUnique({
        where: { email }
    });

    if (email === userInfo) {
        prisma.user.create({

        })
    }

}