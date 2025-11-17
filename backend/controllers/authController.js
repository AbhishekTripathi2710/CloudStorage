const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../db/db");
const dotenv = require("dotenv");
dotenv.config();

const SALT_ROUNDS = 10;

async function register(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const [rows] = await pool.query(
            'SELECT user_id FROM users WHERE email = ?',
            [email]
        );
        if (rows.length)
            return res.status(409).json({ error: 'Email already in use' });

        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        const [result] = await pool.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hash]
        );

        const userId = result.insertId;

        const token = jwt.sign(
            { user_id: userId, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60,
        });

        return res
            .status(201)
            .json({ user: { user_id: userId, username, email } });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(401).json({ error: "Missing Fields" });

    try {
        const [rows] = await pool.query(
            "SELECT user_id, username, email, password FROM users WHERE email = ?",
            [email]
        );

        if (!rows.length)
            return res.status(401).json({ error: "Invalid credentials" });

        const user = rows[0];

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { user_id: user.user_id, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === "true",
            sameSite: "lax",
            maxAge: 1000 * 60 * 60,
        });

        return res.json({
            user: {
                user_id: user.user_id,
                username: user.username,
                email,
            },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

async function logout(req, res) {
    res.clearCookie("token");
    return res.json({ ok: true });
}

module.exports = { login, logout, register };
