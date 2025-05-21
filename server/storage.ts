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
    const user: User = { ...insertUser, id, createdAt: now };
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
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async createCheckIn(insertCheckIn: InsertCheckIn): Promise<CheckIn> {
    const id = this.checkInCurrentId++;
    const now = new Date();
    const checkIn: CheckIn = { ...insertCheckIn, id, createdAt: now };
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
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
  
  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.exerciseCurrentId++;
    const now = new Date();
    const exercise: Exercise = { ...insertExercise, id, createdAt: now };
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
    const resource: Resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }
  
  // Statistics methods
  async getCheckInStreak(userId: number): Promise<number> {
    const userCheckIns = await this.getCheckInsByUserId(userId);
    if (userCheckIns.length === 0) return 0;
    
    // Sort by date (newest first)
    userCheckIns.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    let streak = 1;
    let currentDate = new Date(userCheckIns[0].createdAt);
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 1; i < userCheckIns.length; i++) {
      const checkInDate = new Date(userCheckIns[i].createdAt);
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
    userCheckIns.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return new Date(userCheckIns[0].createdAt);
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
      this.resources.set(id, { ...resource, id });
    });
  }
}

export const storage = new MemStorage();
