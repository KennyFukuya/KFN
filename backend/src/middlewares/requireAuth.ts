import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "google-auth-library";
import oAuth2Client from "../clients/oAuth2Client";

export const isTokenExpired = async (token: string): Promise<boolean> => {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload() as TokenPayload;
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();

    return expirationTime < currentTime;
  } catch (error) {
    console.error("Error verifying token:", error);
    return true; // Treat token as expired if verification fails
  }
};

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  // Check if the user is authenticated
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract the token from the authorization header
  const token = authorizationHeader.split(" ")[1];

  // Additional checks for authentication, such as token validation, can be performed here
  const isExpired = await isTokenExpired(token);

  if (isExpired) {
    return res.status(401).json({ error: "Token expired" });
  }

  // If the user is authenticated, proceed to the next middleware or route handler
  next();
};

export default requireAuth;
