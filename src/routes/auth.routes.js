import { Router } from "express";
import { loginUser } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login and JWT token generation
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/protected:
 *   get:
 *     summary: Example protected route
 *     security:
 *       - bearerAuth: []
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access granted
 */
router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!`, user: req.user });
});

export default router;
