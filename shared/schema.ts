import { pgTable, text, serial, integer, boolean, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  coins: integer("coins").default(0).notNull(),
  cash: integer("cash").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tournament Schema
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  bannerImage: text("banner_image"),
  gameMode: text("game_mode").notNull(), // Solo, Duo, Squad
  mapName: text("map_name").notNull(), // Bermuda, Kalahari, Purgatory
  entryFee: integer("entry_fee").default(0).notNull(),
  prizePool: integer("prize_pool").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  startTime: timestamp("start_time").notNull(),
  status: text("status").notNull(), // Upcoming, Live, Completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
});

// Teams Schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  ownerId: integer("owner_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Team Members Schema
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").notNull().references(() => teams.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").default("member").notNull(), // owner, captain, member
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    teamUserUnique: unique().on(table.teamId, table.userId),
  };
});

// Tournament Participants Schema
export const participants = pgTable("participants", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull().references(() => tournaments.id),
  userId: integer("user_id").notNull().references(() => users.id),
  teamId: integer("team_id").references(() => teams.id),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
  status: text("status").default("registered").notNull(), // registered, playing, completed
}, (table) => {
  return {
    tournamentUserUnique: unique().on(table.tournamentId, table.userId),
  };
});

// Match Schema
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull().references(() => tournaments.id),
  roomId: text("room_id"),
  password: text("password"),
  startTime: timestamp("start_time"),
  status: text("status").default("scheduled").notNull(), // scheduled, live, completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Match Results Schema
export const matchResults = pgTable("match_results", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull().references(() => matches.id),
  userId: integer("user_id").notNull().references(() => users.id),
  position: integer("position"),
  kills: integer("kills").default(0),
  points: integer("points").default(0),
  screenshot: text("screenshot"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
  return {
    matchUserUnique: unique().on(table.matchId, table.userId),
  };
});

// Transactions Schema
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // deposit, withdrawal, entry_fee, prize
  status: text("status").default("pending").notNull(), // pending, completed, failed
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Export schemas and types
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  avatar: true,
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  createdAt: true,
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export const insertParticipantSchema = createInsertSchema(participants).omit({
  id: true,
  joinedAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

export type InsertParticipant = z.infer<typeof insertParticipantSchema>;
export type Participant = typeof participants.$inferSelect;

export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
