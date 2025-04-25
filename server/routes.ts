import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertTournamentSchema, insertTeamSchema, insertParticipantSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const tournaments = await storage.getTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });
  
  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tournament = await storage.getTournament(id);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });
  
  app.post("/api/tournaments", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const validatedData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(validatedData);
      res.status(201).json(tournament);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tournament data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create tournament" });
    }
  });
  
  // Participant routes
  app.get("/api/tournaments/:id/participants", async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.id);
      const participants = await storage.getParticipants(tournamentId);
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch participants" });
    }
  });
  
  app.post("/api/tournaments/:id/join", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const tournamentId = parseInt(req.params.id);
      const tournament = await storage.getTournament(tournamentId);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      // Check if user has enough coins
      const user = req.user!;
      if (user.coins < tournament.entryFee) {
        return res.status(400).json({ message: "Insufficient coins" });
      }
      
      // Check if tournament is full
      const participants = await storage.getParticipants(tournamentId);
      if (participants.length >= tournament.maxParticipants) {
        return res.status(400).json({ message: "Tournament is full" });
      }
      
      const participantData = {
        tournamentId,
        userId: user.id,
        teamId: req.body.teamId,
        status: "registered"
      };
      
      await storage.joinTournament(participantData);
      res.status(200).json({ message: "Successfully joined tournament" });
    } catch (error) {
      res.status(500).json({ message: "Failed to join tournament" });
    }
  });
  
  // Team routes
  app.get("/api/teams", async (req, res) => {
    try {
      const teams = await storage.getTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teams" });
    }
  });
  
  app.get("/api/teams/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const team = await storage.getTeam(id);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team" });
    }
  });
  
  app.get("/api/user/teams", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const teams = await storage.getUserTeams(req.user!.id);
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user teams" });
    }
  });
  
  app.post("/api/teams", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const validatedData = insertTeamSchema.parse({
        ...req.body,
        ownerId: req.user!.id
      });
      
      const team = await storage.createTeam(validatedData);
      res.status(201).json(team);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid team data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create team" });
    }
  });
  
  app.post("/api/teams/:id/members", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const teamId = parseInt(req.params.id);
      const team = await storage.getTeam(teamId);
      
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      
      // Only owner can add members
      if (team.ownerId !== req.user!.id) {
        return res.status(403).json({ message: "Only team owner can add members" });
      }
      
      const { userId, role } = req.body;
      if (!userId || !role) {
        return res.status(400).json({ message: "userId and role are required" });
      }
      
      await storage.addTeamMember(teamId, userId, role);
      res.status(200).json({ message: "Team member added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add team member" });
    }
  });
  
  // Transaction routes
  app.get("/api/user/transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const transactions = await storage.getTransactions(req.user!.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  
  app.post("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const transaction = await storage.createTransaction(validatedData);
      
      // Update user balance for deposits or withdrawals
      if (validatedData.type === "deposit" && validatedData.status === "completed") {
        await storage.updateUserCoins(req.user!.id, validatedData.amount);
      }
      
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create transaction" });
    }
  });
  
  // Leaderboard route
  app.get("/api/leaderboard", async (req, res) => {
    try {
      // For development, just return an array of users sorted by coins
      const users = Array.from(await Promise.all(
        Array.from({ length: 10 }, async (_, i) => storage.getUser(i + 1))
      )).filter(Boolean) as any[];
      
      const leaderboard = users.map(user => ({
        id: user.id,
        username: user.username,
        coins: user.coins,
        matches: Math.floor(Math.random() * 30) + 10,
        kills: Math.floor(Math.random() * 200) + 50,
        wins: Math.floor(Math.random() * 15),
      })).sort((a, b) => b.coins - a.coins);
      
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
