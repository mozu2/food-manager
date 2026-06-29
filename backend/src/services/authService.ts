
import { AppError } from "../middleware/errorHandler";
import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function register(email: string, password: string) {


    const userInfo = await prisma.user.findUnique({
        where: { email }
    });

    if (userInfo) {
        throw new AppError(400, "このメアドは使用されているよ～");
    }

    const saltRounds = 10; // ハッシュ化の度合い値
    const hashpass = await bcrypt.hash(password, saltRounds);

    const data = await prisma.user.create({
        data: {
            email: email,
            password: hashpass,
        }
    });

    const token = jwt.sign(
        { userId: data.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );


    return token;
}

export async function login(email: string, password: string) {

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError(401, "パスワードまたはメアドが違います")
    };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError(401, "パスワードが違います")
    };

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    return token;
}