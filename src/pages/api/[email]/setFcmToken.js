import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prismadb";

export default async function handler(req, res) {
  const session = await getSession({ req });

  const { email } = req.query;

  if (session && session.user.email == email) {
    if (req.method === "POST") {
      const user = await prisma.user.update({
        where: { email: String(session.user.email) },
        data: { fcmToken: String(req.body.fcmToken) },
      });

      res.status(200).json({ data: user, message: "Success" });
    } else {
      res.status(405).json({ message: "Incorrect method." });
    }
  } else {
    return res.status(401).json({ message: "Authentication failed" });
  }
}
