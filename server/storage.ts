import { 
  users, 
  blogPosts, 
  blogRatings, 
  blogComments, 
  notifications, 
  resourceCards,
  type User, 
  type UpsertUser,
  type BlogPost,
  type InsertBlogPost,
  type BlogRating,
  type InsertBlogRating,
  type BlogComment,
  type InsertBlogComment,
  type Notification,
  type InsertNotification,
  type ResourceCard,
  type InsertResourceCard
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Blog methods
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  rateBlogPost(rating: InsertBlogRating): Promise<BlogRating>;
  addBlogComment(comment: InsertBlogComment): Promise<BlogComment>;
  getBlogComments(postId: string): Promise<BlogComment[]>;
  
  // Admin methods
  getNotifications(): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: string, updates: Partial<InsertNotification>): Promise<Notification>;
  getActiveNotifications(): Promise<Notification[]>;
  
  getResourceCards(): Promise<ResourceCard[]>;
  updateResourceCard(id: string, updates: Partial<InsertResourceCard>): Promise<ResourceCard>;
  getActiveResourceCards(): Promise<ResourceCard[]>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const [existingUser] = await db.select().from(users).where(eq(users.id, user.id!));
    
    if (existingUser) {
      const [updatedUser] = await db
        .update(users)
        .set({ ...user, updatedAt: new Date() })
        .where(eq(users.id, user.id!))
        .returning();
      return updatedUser;
    } else {
      const [newUser] = await db
        .insert(users)
        .values(user)
        .returning();
      return newUser;
    }
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async rateBlogPost(rating: InsertBlogRating): Promise<BlogRating> {
    // Check if user already rated this post
    const [existingRating] = await db
      .select()
      .from(blogRatings)
      .where(and(eq(blogRatings.postId, rating.postId!), eq(blogRatings.userId, rating.userId!)));

    if (existingRating) {
      const [updatedRating] = await db
        .update(blogRatings)
        .set({ rating: rating.rating })
        .where(eq(blogRatings.id, existingRating.id))
        .returning();
      return updatedRating;
    } else {
      const [newRating] = await db
        .insert(blogRatings)
        .values(rating)
        .returning();
      return newRating;
    }
  }

  async addBlogComment(comment: InsertBlogComment): Promise<BlogComment> {
    const [newComment] = await db
      .insert(blogComments)
      .values(comment)
      .returning();
    return newComment;
  }

  async getBlogComments(postId: string): Promise<BlogComment[]> {
    return await db
      .select()
      .from(blogComments)
      .where(eq(blogComments.postId, postId))
      .orderBy(desc(blogComments.createdAt));
  }

  async getNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async updateNotification(id: string, updates: Partial<InsertNotification>): Promise<Notification> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification;
  }

  async getActiveNotifications(): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.isActive, true))
      .orderBy(desc(notifications.createdAt));
  }

  async getResourceCards(): Promise<ResourceCard[]> {
    return await db.select().from(resourceCards).orderBy(resourceCards.sortOrder);
  }

  async updateResourceCard(id: string, updates: Partial<InsertResourceCard>): Promise<ResourceCard> {
    const [updatedCard] = await db
      .update(resourceCards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(resourceCards.id, id))
      .returning();
    return updatedCard;
  }

  async getActiveResourceCards(): Promise<ResourceCard[]> {
    return await db
      .select()
      .from(resourceCards)
      .where(eq(resourceCards.isActive, true))
      .orderBy(resourceCards.sortOrder);
  }
}

export const storage = new DatabaseStorage();