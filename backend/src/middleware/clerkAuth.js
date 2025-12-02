import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import User from "../models/User.js";

// Middleware that accepts either HS256 tokens (signed by this backend using JWT_SECRET)
// or RS256 tokens (issued by Clerk or other OIDC providers). For RS256, set CLERK_JWKS_URL in .env

const clerkAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "No authentication token, access denied" });
    const token = authHeader.replace("Bearer ", "");

    // Decode header to inspect algorithm
    const decodedHeader = jwt.decode(token, { complete: true })?.header;
    const alg = decodedHeader?.alg;

    // If HS256 and JWT_SECRET exists, verify using shared secret (legacy)
    if (alg === "HS256") {
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET not set for HS256 verification");
        return res.status(500).json({ message: "Server misconfiguration: JWT secret not set" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) return res.status(401).json({ message: "Token is not valid" });
      req.user = user;
      return next();
    }

    // If RS256 (Clerk), verify using JWKS
    if (alg && alg.startsWith("RS")) {
      const jwksUrl = process.env.CLERK_JWKS_URL;
      if (!jwksUrl) {
        console.error("CLERK_JWKS_URL not set for RS256 token verification");
        return res.status(500).json({ message: "Server misconfiguration: Clerk JWKS URL not set" });
      }

      const client = jwksClient({ jwksUri: jwksUrl });

      const getKey = (header, callback) => {
        client.getSigningKey(header.kid, function (err, key) {
          if (err) return callback(err);
          const signingKey = key.getPublicKey();
          callback(null, signingKey);
        });
      };

      jwt.verify(token, getKey, { algorithms: ["RS256"] }, async (err, decoded) => {
        if (err) {
          console.error("Clerk token verification failed:", err.message);
          return res.status(401).json({ message: "Token verification failed" });
        }

        // Clerk tokens contain subject/email info; depending on your app you may want to
        // map Clerk user id to a local user. For now attach decoded token to req.clerk
        req.clerk = decoded;

        // If you still want local users, try to find a local user by email or clerk id
        if (decoded.email) {
          const user = await User.findOne({ email: decoded.email }).select("-password");
          if (user) req.user = user;
        }

        return next();
      });

      return;
    }

    // Unknown algorithm
    console.error("Unsupported token algorithm:", alg);
    return res.status(401).json({ message: `Unsupported token algorithm: ${alg}` });
  } catch (error) {
    console.error("Authentication error in clerkAuth:", error.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default clerkAuth;
