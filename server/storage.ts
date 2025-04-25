import { users, tournaments, teams, teamMembers, participants, matches, matchResults, transactions } from "@shared/schema";
import type { 
  User, InsertUser, 
  Tournament, InsertTournament,
  Team, InsertTeam,
  InsertParticipant, Participant,
  Match, InsertMatch,
  Transaction, InsertTransaction
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCoins(userId: number, amount: number): Promise<void>;
  
  // Tournament operations
  getTournaments(): Promise<Tournament[]>;
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournamentStatus(id: number, status: string): Promise<void>;
  
  // Team operations
  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  getUserTeams(userId: number): Promise<Team[]>;
  createTeam(team: InsertTeam): Promise<Team>;
  addTeamMember(teamId: number, userId: number, role: string): Promise<void>;
  
  // Participant operations
  getParticipants(tournamentId: number): Promise<Participant[]>;
  joinTournament(participant: InsertParticipant): Promise<void>;
  
  // Match operations
  getMatches(tournamentId: number): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  
  // Transaction operations
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Session store
  sessionStore: session.SessionStore;
}

// In-memory implementation of storage
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tournaments: Map<number, Tournament>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, { id: number, teamId: number, userId: number, role: string, createdAt: Date }>;
  private participants: Map<number, Participant>;
  private matches: Map<number, Match>;
  private matchResults: Map<number, { id: number, matchId: number, userId: number, position: number, kills: number, points: number, screenshot: string, createdAt: Date }>;
  private transactions: Map<number, Transaction>;
  
  private userIdCounter: number;
  private tournamentIdCounter: number;
  private teamIdCounter: number;
  private teamMemberIdCounter: number;
  private participantIdCounter: number;
  private matchIdCounter: number;
  private matchResultIdCounter: number;
  private transactionIdCounter: number;
  
  sessionStore: session.SessionStore;
  
  constructor() {
    this.users = new Map();
    this.tournaments = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.participants = new Map();
    this.matches = new Map();
    this.matchResults = new Map();
    this.transactions = new Map();
    
    this.userIdCounter = 1;
    this.tournamentIdCounter = 1;
    this.teamIdCounter = 1;
    this.teamMemberIdCounter = 1;
    this.participantIdCounter = 1;
    this.matchIdCounter = 1;
    this.matchResultIdCounter = 1;
    this.transactionIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Initialize with some demo data
    this.setupDemoData();
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      coins: 100, // Start with some coins
      cash: 0,
      createdAt: now 
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserCoins(userId: number, amount: number): Promise<void> {
    const user = await this.getUser(userId);
    if (user) {
      user.coins += amount;
      this.users.set(userId, user);
    }
  }
  
  // Tournament operations
  async getTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }
  
  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }
  
  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const id = this.tournamentIdCounter++;
    const createdAt = new Date();
    const newTournament: Tournament = { ...tournament, id, createdAt };
    this.tournaments.set(id, newTournament);
    return newTournament;
  }
  
  async updateTournamentStatus(id: number, status: string): Promise<void> {
    const tournament = await this.getTournament(id);
    if (tournament) {
      tournament.status = status;
      this.tournaments.set(id, tournament);
    }
  }
  
  // Team operations
  async getTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }
  
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async getUserTeams(userId: number): Promise<Team[]> {
    const memberEntries = Array.from(this.teamMembers.values()).filter(
      (member) => member.userId === userId
    );
    
    const teamIds = memberEntries.map((member) => member.teamId);
    return Array.from(this.teams.values()).filter((team) => 
      teamIds.includes(team.id)
    );
  }
  
  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.teamIdCounter++;
    const createdAt = new Date();
    const newTeam: Team = { ...team, id, createdAt };
    this.teams.set(id, newTeam);
    
    // Add owner as a team member
    await this.addTeamMember(id, team.ownerId, "owner");
    
    return newTeam;
  }
  
  async addTeamMember(teamId: number, userId: number, role: string): Promise<void> {
    const id = this.teamMemberIdCounter++;
    const createdAt = new Date();
    this.teamMembers.set(id, { id, teamId, userId, role, createdAt });
  }
  
  // Participant operations
  async getParticipants(tournamentId: number): Promise<Participant[]> {
    return Array.from(this.participants.values()).filter(
      (participant) => participant.tournamentId === tournamentId
    );
  }
  
  async joinTournament(participant: InsertParticipant): Promise<void> {
    const id = this.participantIdCounter++;
    const joinedAt = new Date();
    const newParticipant: Participant = { ...participant, id, joinedAt };
    this.participants.set(id, newParticipant);
    
    // Deduct entry fee if applicable
    const tournament = await this.getTournament(participant.tournamentId);
    if (tournament && tournament.entryFee > 0) {
      await this.updateUserCoins(participant.userId, -tournament.entryFee);
      
      // Record the transaction
      await this.createTransaction({
        userId: participant.userId,
        amount: -tournament.entryFee,
        type: "entry_fee",
        status: "completed",
        reference: `Tournament entry: ${tournament.title}`
      });
    }
  }
  
  // Match operations
  async getMatches(tournamentId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      (match) => match.tournamentId === tournamentId
    );
  }
  
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.matchIdCounter++;
    const createdAt = new Date();
    const newMatch: Match = { ...match, id, createdAt };
    this.matches.set(id, newMatch);
    return newMatch;
  }
  
  // Transaction operations
  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId
    );
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const createdAt = new Date();
    const newTransaction: Transaction = { ...transaction, id, createdAt };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }
  
  // Initialize demo data for development
  private setupDemoData() {
    // Sample tournaments with different modes
    const tournamentTypes = [
      { title: "Weekend War", mode: "Squad", map: "Bermuda", fee: 100, prize: 5000, maxPlayers: 100 },
      { title: "Kill Master Pro", mode: "Solo", map: "Kalahari", fee: 50, prize: 2000, maxPlayers: 50 },
      { title: "Duo Destroyers", mode: "Duo", map: "Purgatory", fee: 75, prize: 3500, maxPlayers: 50 },
      { title: "Elite Showdown", mode: "Squad", map: "Bermuda", fee: 150, prize: 10000, maxPlayers: 100 },
      { title: "Survival Kings", mode: "Solo", map: "Kalahari", fee: 80, prize: 5000, maxPlayers: 50 }
    ];
    
    // Create tournaments
    const now = new Date();
    tournamentTypes.forEach((t, index) => {
      const startTime = new Date(now);
      startTime.setHours(startTime.getHours() + (index + 1) * 4); // Staggered start times
      
      this.createTournament({
        title: t.title,
        description: `Compete in this exciting ${t.mode} tournament and win big prizes!`,
        bannerImage: "", // Will be set via UI
        gameMode: t.mode,
        mapName: t.map,
        entryFee: t.fee,
        prizePool: t.prize,
        maxParticipants: t.maxPlayers,
        startTime,
        status: index < 2 ? "Live" : "Upcoming",
        createdBy: 1 // Admin user
      });
    });
  }
}

export const storage = new MemStorage();
