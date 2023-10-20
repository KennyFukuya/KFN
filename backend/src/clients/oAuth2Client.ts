import { OAuth2Client } from "google-auth-library";

export const clientId = process.env.CLIENT_ID as string;

export const clientSecret = process.env.CLIENT_SECRET as string;

const oAuth2Client = new OAuth2Client(
  clientId,
  clientSecret,
  "postmessage"
);

export default oAuth2Client