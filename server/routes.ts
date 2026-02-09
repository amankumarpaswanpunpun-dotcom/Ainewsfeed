import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import axios from "axios";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";

const pgSession = connectPgSimple(session);

import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "NEWS-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage_multer });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Serve uploaded files statically
  app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

  // --- Auth Setup ---
  app.use(
    session({
      store: new pgSession({
        pool,
        tableName: "session",
      }),
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Incorrect email." });
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "Incorrect password." });
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // --- Auth Routes ---
  app.post("/api/register", async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ name, email, password: hashedPassword });
      req.login(user, (err) => {
        if (err) return next(err);
        res.json({ msg: "Registered and logged in", user });
      });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(400).json({ msg: info.message || "Login failed" });
      req.login(user, (err) => {
        if (err) return next(err);
        res.json({ msg: "Login success", user });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.json({ msg: "Logged out" });
    });
  });

  app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ msg: "Not authenticated" });
    }
  });

  // --- Post Routes ---
  app.post(api.posts.create.path, upload.single("image"), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ msg: "Unauthorized" });
    try {
      const { title, content, author } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
      
      const post = await storage.createPost({ 
        title, 
        content, 
        author, 
        imageUrl 
      });
      res.status(201).json(post);
    } catch (err) {
      console.error("Post creation error:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getAllPosts();
    res.json(posts);
  });

  // --- News Route ---
  app.get(api.news.list.path, async (req, res) => {
    try {
      if (!process.env.NEWS_API) {
        // Return mock data if no key
        return res.json([
          {
            title: "News API Key Missing",
            description: "Please add a NEWS_API key to .env or Secrets to see real news.",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "System" }
          },
          {
            title: "Welcome to Pulse",
            description: "This is a sample news item to demonstrate the layout.",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "Pulse Team" }
          }
        ]);
      }
      
      const r = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API}`
      );
      res.json(r.data.articles);
    } catch (err) {
      console.error("News API Error:", err);
      res.status(500).json({ msg: "Failed to fetch news" });
    }
  });

  // Seed default post if none exist
  const posts = await storage.getAllPosts();
  if (posts.length === 0) {
    await storage.createPost({
      title: "Welcome to Pulse",
      content: "This is the start of something new! Register to create your own posts.",
      author: "Admin"
    });
  }

  return httpServer;
}
