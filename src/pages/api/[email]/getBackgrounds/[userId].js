import prisma from "../../../../../lib/prismadb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  const { email, userId } = req.query;

  if (session && session.user.email == email) {
    if (req.method === "GET") {
      const background = await prisma.TwoDBackground.findMany({
        where: {
          userId: userId,
        },
      });

      res.status(200).json(background);
    } else {
      res.status(405).json({ message: "Incorrect method." });
    }
  } else {
    return res.status(401).json({ message: "Authentication failed" });
  }
}
