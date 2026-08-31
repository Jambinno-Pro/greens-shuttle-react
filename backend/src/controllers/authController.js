// import { loginAdmin } from "../services/authServices.js";

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const result = await loginAdmin(email, password);

//     return res.status(200).json({
//       success: true,
//       message: "Login successful.",
//       token: result.token,
//       user: result.user,
//     });
//   } catch (error) {
//     console.error("Login error:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: error.message || "Invalid email or password.",
//     });
//   }
// };
