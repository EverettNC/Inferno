import { 
  users, 
  type User, 
  type InsertUser,
  checkIns,
  type CheckIn,
  type InsertCheckIn,
  exercises,
  type Exercise,
  type InsertExercise,
  resources,
  type Resource,
  type InsertResource
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  
  // Check-in methods
  getCheckIn(id: number): Promise<CheckIn | undefined>;
  getCheckInsByUserId(userId: number): Promise<CheckIn[]>;
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  
  // Exercise methods
  getExercise(id: number): Promise<Exercise | undefined>;
  getExercisesByUserId(userId: number): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: number, data: Partial<InsertExercise>): Promise<Exercise | undefined>;
  
  // Resource methods
  getResource(id: number): Promise<Resource | undefined>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getAllResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Statistics methods
  getCheckInStreak(userId: number): Promise<number>;
  getLastCheckInDate(userId: number): Promise<Date | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private checkIns: Map<number, CheckIn>;
  private exercises: Map<number, Exercise>;
  private resources: Map<number, Resource>;
  private userCurrentId: number;
  private checkInCurrentId: number;
  private exerciseCurrentId: number;
  private resourceCurrentId: number;

  constructor() {
    this.users = new Map();
    this.checkIns = new Map();
    this.exercises = new Map();
    this.resources = new Map();
    this.userCurrentId = 1;
    this.checkInCurrentId = 1;
    this.exerciseCurrentId = 1;
    this.resourceCurrentId = 1;
    
    // Initialize with default resources
    this.initializeResources();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      firstName: insertUser.firstName ?? null,
      lastName: insertUser.lastName ?? null,
      preferredLanguage: insertUser.preferredLanguage ?? null,
      voiceModeEnabled: insertUser.voiceModeEnabled ?? null,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Check-in methods
  async getCheckIn(id: number): Promise<CheckIn | undefined> {
    return this.checkIns.get(id);
  }
  
  async getCheckInsByUserId(userId: number): Promise<CheckIn[]> {
    return Array.from(this.checkIns.values())
      .filter(checkIn => checkIn.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }
  
  async createCheckIn(insertCheckIn: InsertCheckIn): Promise<CheckIn> {
    const id = this.checkInCurrentId++;
    const now = new Date();
    const checkIn: CheckIn = {
      id,
      createdAt: now,
      userId: insertCheckIn.userId,
      mood: insertCheckIn.mood,
      notes: insertCheckIn.notes ?? null
    };
    this.checkIns.set(id, checkIn);
    return checkIn;
  }
  
  // Exercise methods
  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }
  
  async getExercisesByUserId(userId: number): Promise<Exercise[]> {
    return Array.from(this.exercises.values())
      .filter(exercise => exercise.userId === userId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }
  
  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseCurrentId++;
    const now = new Date();
    const exercise: Exercise = {
      id,
      createdAt: now,
      type: insertExercise.type,
      userId: insertExercise.userId,
      duration: insertExercise.duration ?? null,
      subtype: insertExercise.subtype ?? null,
      completed: insertExercise.completed ?? null
    };
    this.exercises.set(id, exercise);
    return exercise;
  }
  
  async updateExercise(id: number, data: Partial<InsertExercise>): Promise<Exercise | undefined> {
    const exercise = await this.getExercise(id);
    if (!exercise) return undefined;
    
    const updatedExercise = { ...exercise, ...data };
    this.exercises.set(id, updatedExercise);
    return updatedExercise;
  }
  
  // Resource methods
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }
  
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .filter(resource => resource.category === category);
  }
  
  async getAllResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceCurrentId++;
    const resource: Resource = {
      id,
      title: insertResource.title,
      type: insertResource.type,
      icon: insertResource.icon ?? null,
      url: insertResource.url ?? null,
      description: insertResource.description ?? null,
      category: insertResource.category ?? null
    };
    this.resources.set(id, resource);
    return resource;
  }
  
  // Statistics methods
  async getCheckInStreak(userId: number): Promise<number> {
    const userCheckIns = await this.getCheckInsByUserId(userId);
    if (userCheckIns.length === 0) return 0;
    
    // Sort by date (newest first)
    userCheckIns.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    let streak = 1;
    let currentDate = userCheckIns[0].createdAt ? new Date(userCheckIns[0].createdAt) : new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < userCheckIns.length; i++) {
      if (!userCheckIns[i].createdAt) continue;
      const checkInDate = new Date(userCheckIns[i].createdAt!);
      checkInDate.setHours(0, 0, 0, 0);
      
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      if (checkInDate.getTime() === prevDate.getTime()) {
        streak++;
        currentDate = checkInDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
  
  async getLastCheckInDate(userId: number): Promise<Date | undefined> {
    const userCheckIns = await this.getCheckInsByUserId(userId);
    if (userCheckIns.length === 0) return undefined;
    
    // Sort by date (newest first)
    userCheckIns.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    
    return userCheckIns[0].createdAt ? new Date(userCheckIns[0].createdAt) : undefined;
  }
  
  // Initialize default resources
  private initializeResources() {
    const defaultResources: InsertResource[] = [
      {
        title: "What is PTSD?",
        description: "Learn about Post-Traumatic Stress Disorder, its symptoms, causes, and how it affects daily life.",
        type: "article",
        url: "https://www.ptsd.va.gov/understand/what/index.asp",
        icon: "fas fa-book",
        category: "education"
      },
      {
        title: "The Science of Anxiety",
        description: "Understand how anxiety affects your brain and body, and why certain techniques help reduce symptoms.",
        type: "article",
        url: "https://www.anxiety.org/science-of-anxiety",
        icon: "fas fa-brain",
        category: "education"
      },
      {
        title: "How Grounding Techniques Work",
        description: "Dr. Sarah Johnson explains the neuroscience behind grounding techniques and why they're effective for PTSD.",
        type: "video",
        url: "https://www.youtube.com/watch?v=example1",
        icon: "fas fa-play-circle",
        category: "education"
      },
      {
        title: "Veterans Share Their Healing Journey",
        description: "Three veterans discuss their experiences with PTSD and the techniques that helped them recover.",
        type: "video",
        url: "https://www.youtube.com/watch?v=example2",
        icon: "fas fa-play-circle",
        category: "stories"
      },
      {
        title: "PTSD Foundation of America",
        description: "Offering peer-to-peer mentoring and support groups for veterans and their families.",
        type: "community",
        url: "https://ptsdusa.org",
        icon: "fas fa-users",
        category: "support"
      },
      {
        title: "Anxiety and Depression Association of America",
        description: "Find support groups, therapist directories, and online communities for anxiety disorders.",
        type: "community",
        url: "https://adaa.org",
        icon: "fas fa-users",
        category: "support"
      },
      {
        title: "National Center for PTSD",
        description: "Educational resources and research from the U.S. Department of Veterans Affairs.",
        type: "community",
        url: "https://www.ptsd.va.gov",
        icon: "fas fa-graduation-cap",
        category: "support"
      }
    ];
    
    defaultResources.forEach(resource => {
      const id = this.resourceCurrentId++;
      const fullResource: Resource = {
        id,
        title: resource.title,
        type: resource.type,
        icon: resource.icon ?? null,
        url: resource.url ?? null,
        description: resource.description ?? null,
        category: resource.category ?? null
      };
      this.resources.set(id, fullResource);
    });
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Check-in methods
  async getCheckIn(id: number): Promise<CheckIn | undefined> {
    const [checkIn] = await db.select().from(checkIns).where(eq(checkIns.id, id));
    return checkIn;
  }
  
  async getCheckInsByUserId(userId: number): Promise<CheckIn[]> {
    return db
      .select()
      .from(checkIns)
      .where(eq(checkIns.userId, userId))
      .orderBy(desc(checkIns.createdAt));
  }
  
  async createCheckIn(insertCheckIn: InsertCheckIn): Promise<CheckIn> {
    const [checkIn] = await db
      .insert(checkIns)
      .values(insertCheckIn)
      .returning();
    return checkIn;
  }
  
  // Exercise methods
  async getExercise(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }
  
  async getExercisesByUserId(userId: number): Promise<Exercise[]> {
    return db
      .select()
      .from(exercises)
      .where(eq(exercises.userId, userId))
      .orderBy(desc(exercises.createdAt));
  }
  
  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const [exercise] = await db
      .insert(exercises)
      .values(insertExercise)
      .returning();
    return exercise;
  }
  
  async updateExercise(id: number, data: Partial<InsertExercise>): Promise<Exercise | undefined> {
    const [updatedExercise] = await db
      .update(exercises)
      .set(data)
      .where(eq(exercises.id, id))
      .returning();
    return updatedExercise;
  }
  
  // Resource methods
  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource;
  }
  
  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return db
      .select()
      .from(resources)
      .where(eq(resources.category, category));
  }
  
  async getAllResources(): Promise<Resource[]> {
    return db.select().from(resources);
  }
  
  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(insertResource)
      .returning();
    return resource;
  }
  
  // Statistics methods
  async getCheckInStreak(userId: number): Promise<number> {
    const userCheckIns = await this.getCheckInsByUserId(userId);
    if (userCheckIns.length === 0) return 0;
    
    // Sort by date (newest first)
    let streak = 1;
    let currentDate = new Date(userCheckIns[0].createdAt!);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < userCheckIns.length; i++) {
      if (!userCheckIns[i].createdAt) continue;
      
      const checkInDate = new Date(userCheckIns[i].createdAt!);
      checkInDate.setHours(0, 0, 0, 0);
      
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      
      if (checkInDate.getTime() === prevDate.getTime()) {
        streak++;
        currentDate = checkInDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
  
  async getLastCheckInDate(userId: number): Promise<Date | undefined> {
    const [latestCheckIn] = await db
      .select()
      .from(checkIns)
      .where(eq(checkIns.userId, userId))
      .orderBy(desc(checkIns.createdAt))
      .limit(1);
    
    return latestCheckIn?.createdAt ? new Date(latestCheckIn.createdAt) : undefined;
  }

  // Initialize resources if they don't exist
  async initializeResourcesIfEmpty() {
    const existingResources = await this.getAllResources();
    
    if (existingResources.length === 0) {
      const defaultResources: InsertResource[] = [
        {
          title: "What is PTSD?",
          description: "Learn about Post-Traumatic Stress Disorder, its symptoms, causes, and how it affects daily life.",
          type: "article",
          url: "https://www.ptsd.va.gov/understand/what/index.asp",
          icon: "fas fa-book",
          category: "education"
        },
        {
          title: "The Science of Anxiety",
          description: "Understand how anxiety affects your brain and body, and why certain techniques help reduce symptoms.",
          type: "article",
          url: "https://www.anxiety.org/science-of-anxiety",
          icon: "fas fa-brain",
          category: "education"
        },
        {
          title: "How Grounding Techniques Work",
          description: "Dr. Sarah Johnson explains the neuroscience behind grounding techniques and why they're effective for PTSD.",
          type: "video",
          url: "https://www.youtube.com/watch?v=example1",
          icon: "fas fa-play-circle",
          category: "education"
        },
        {
          title: "Veterans Share Their Healing Journey",
          description: "Three veterans discuss their experiences with PTSD and the techniques that helped them recover.",
          type: "video",
          url: "https://www.youtube.com/watch?v=example2",
          icon: "fas fa-play-circle",
          category: "stories"
        },
        {
          title: "PTSD Foundation of America",
          description: "Offering peer-to-peer mentoring and support groups for veterans and their families.",
          type: "community",
          url: "https://ptsdusa.org",
          icon: "fas fa-users",
          category: "support"
        },
        {
          title: "Anxiety and Depression Association of America",
          description: "Find support groups, therapist directories, and online communities for anxiety disorders.",
          type: "community",
          url: "https://adaa.org",
          icon: "fas fa-users",
          category: "support"
        },
        {
          title: "National Center for PTSD",
          description: "Educational resources and research from the U.S. Department of Veterans Affairs.",
          type: "community",
          url: "https://www.ptsd.va.gov",
          icon: "fas fa-graduation-cap",
          category: "support"
        }
      ];
      
      for (const resource of defaultResources) {
        await this.createResource(resource);
      }
    }
  }
}

// Create and initialize database storage
export const storage = new DatabaseStorage();

// Initialize default resources
(async () => {
  try {
    await storage.initializeResourcesIfEmpty();
    console.log("Database initialized with default resources if needed");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
})();
