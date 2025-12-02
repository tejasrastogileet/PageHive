import jwt from "jsonwebtoken";
import User from "../models/User.js";

// const response = await fetch(`http://localhost:3000/api/books`, {
//   method: "POST",
//   body: JSON.stringify({
//     title,
//     caption
//   }),
//   headers: { Authorization: `Bearer ${token}` },
// });

const protectRoute = async (req, res, next) => {
  try {
    // get token
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No authentication token, access denied" });

    // Basic diagnostics: ensure JWT_SECRET is present
    if (!process.env.JWT_SECRET) {
      console.error("Authentication error: JWT_SECRET not set in environment");
      return res.status(500).json({ message: "Server misconfiguration: JWT secret not set" });
    }

    // If token uses a different algorithm (e.g., RS256 from Clerk) the verify will fail.
    // Decode header to show algorithm for diagnostics.
    const decodedHeader = jwt.decode(token, { complete: true })?.header;
    if (decodedHeader && decodedHeader.alg && decodedHeader.alg !== "HS256") {
      console.error("Authentication error: token algorithm not supported by this backend:", decodedHeader.alg);
      return res.status(401).json({ message: `Unsupported token algorithm: ${decodedHeader.alg}. Backend expects HS256 or configure Clerk verification.` });
    }

    // verify token (HS256 expected)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "Token is not valid" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default protectRoute;
