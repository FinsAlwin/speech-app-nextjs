import { getSession } from "next-auth/react";
const {
  jwt: { AccessToken },
} = require("twilio");

export default async function handler(req, res) {
  const session = await getSession({ req });
  const VideoGrant = AccessToken.VideoGrant;
  const MAX_ALLOWED_SESSION_DURATION = 14400;

  const { email } = req.query;

  if (session && session.user.email == email) {
    if (req.method === "POST") {
      const identity = req.body.identity;
      const token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET,
        { ttl: MAX_ALLOWED_SESSION_DURATION }
      );

      token.identity = identity;

      const grant = new VideoGrant();
      token.addGrant(grant);

      res.status(200).json({ data: token.toJwt(), message: "Success" });
    } else {
      res.status(405).json({ message: "Incorrect method." });
    }
  } else {
    return res.status(401).json({ message: "Authentication failed" });
  }
}
