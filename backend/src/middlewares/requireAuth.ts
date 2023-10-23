import { Request, Response, NextFunction } from "express";
import { TokenPayload } from "google-auth-library";
import jwt from "jsonwebtoken";
import oAuth2Client from "../clients/oAuth2Client";
import redis from "../redis";

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
    return true;
  }
};

export const isInternalTokenExpired = async (token: string): Promise<boolean> => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    if (payload) {
      const expiredTokens = await redis.get("expiredTokens");

      if (expiredTokens) {
        const idSet = new Set(JSON.parse(expiredTokens));

        if (idSet.has(token)) {
          return true;
        }
      }

      return false;
    }

    return true;
  } catch (error) {
    console.error("Error verifying internal token:", error);
    return true;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = jwt.decode(token);

  if (data && data.source === "internal") {
    const hasTokenExpired = await isInternalTokenExpired(token);

    if (hasTokenExpired) {
      return res.status(401).json({ error: "Token expired" });
    }

    return next();
  } else {
    // Additional checks for authentication, such as token validation, can be performed here
    const isExpired = await isTokenExpired(token);

    if (isExpired) {
      return res.status(401).json({ error: "Token expired" });
    }

    // If the user is authenticated, proceed to the next middleware or route handler
    next();
  }
};

export default requireAuth;
