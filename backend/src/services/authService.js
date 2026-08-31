// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
// const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
// const JWT_SECRET = process.env.JWT_SECRET;

// export const loginAdmin = async (email, password) => {
//   if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
//     throw new Error("Authentication environment variables are not configured.");
//   }

//   if (!email || !password) {
//     throw new Error("Email and password are required.");
//   }

//   const normalizedEmail = email.trim().toLowerCase();

//   if (normalizedEmail !== ADMIN_EMAIL.trim().toLowerCase()) {
//     throw new Error("Invalid email or password.");
//   }

//   const passwordMatches = await bcrypt.compare(password, ADMIN_PASSWORD);

//   if (!passwordMatches) {
//     throw new Error("Invalid email or password.");
//   }

//   const token = jwt.sign(
//     {
//       email: normalizedEmail,
//       role: "admin",
//     },
//     JWT_SECRET,
//     {
//       expiresIn: "8h",
//     },
//   );

//   return {
//     token,
//     user: {
//       email: normalizedEmail,
//       role: "admin",
//     },
//   };
// };
