import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertBlogPostSchema, insertBlogRatingSchema, insertBlogCommentSchema, insertNotificationSchema, insertResourceCardSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Blog routes
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/posts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const post = await storage.getBlogPost(id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post('/api/blog/posts/:id/rate', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      const { rating } = req.body;

      const validatedData = insertBlogRatingSchema.parse({
        postId: id,
        userId,
        rating
      });

      const result = await storage.rateBlogPost(validatedData);
      res.json(result);
    } catch (error) {
      console.error("Error rating blog post:", error);
      res.status(500).json({ message: "Failed to rate blog post" });
    }
  });

  app.post('/api/blog/posts/:id/comment', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      const { content } = req.body;

      const validatedData = insertBlogCommentSchema.parse({
        postId: id,
        userId,
        content
      });

      const comment = await storage.addBlogComment(validatedData);
      res.json(comment);
    } catch (error) {
      console.error("Error adding blog comment:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  app.get('/api/blog/posts/:id/comments', async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getBlogComments(id);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching blog comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  // Admin routes
  app.get('/api/admin/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      res.json({ isAdmin: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  app.get('/api/admin/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const notifications = await storage.getNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/admin/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(validatedData);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.put('/api/admin/notifications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const validatedData = insertNotificationSchema.parse(req.body);
      const notification = await storage.updateNotification(id, validatedData);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Failed to update notification" });
    }
  });

  app.get('/api/admin/resource-cards', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const cards = await storage.getResourceCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource cards" });
    }
  });

  app.put('/api/admin/resource-cards/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { id } = req.params;
      const validatedData = insertResourceCardSchema.parse(req.body);
      const card = await storage.updateResourceCard(id, validatedData);
      res.json(card);
    } catch (error) {
      res.status(500).json({ message: "Failed to update resource card" });
    }
  });

  // Public API routes
  app.get('/api/notifications/active', async (req, res) => {
    try {
      const notifications = await storage.getActiveNotifications();
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.get('/api/resource-cards', async (req, res) => {
    try {
      const cards = await storage.getActiveResourceCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource cards" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
