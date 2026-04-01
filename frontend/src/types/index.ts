export type Stage = "GROUP" | "R32" | "R16" | "QF" | "SF" | "THIRD" | "FINAL";
export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED";

export interface Match {
  id: number;
  external_id: string;
  stage: Stage;
  group_name: string | null;
  match_date: string; // ISO string
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
  matchday: number | null;
}

export interface StandingEntry {
  rank: number;
  participant: string;
  points: number;
  perfect: number;
  correct_outcome: number;
  predictions_made: number;
  matches_scored: number;
}

export interface StandingsResponse {
  generated_at: string;
  standings: StandingEntry[];
}

export interface GroupTeam {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
}

export type GroupsResponse = Record<string, GroupTeam[]>;

export type BracketResponse = Record<Stage, BracketMatch[]>;

export interface BracketMatch {
  id: number;
  external_id: string;
  stage: Stage;
  match_date: string;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
}

export interface ParticipantPredictionSummary {
  name: string;
  predictions_made: number;
  points: number;
  perfect: number;
  correct_outcome: number;
}

export interface PredictionWithOutcome {
  match: Match;
  predicted_home: number;
  predicted_away: number;
  points_earned: number | null;
  is_perfect: boolean;
  is_correct_outcome: boolean;
}

export interface MetaResponse {
  total_matches: number;
  played: number;
  last_sync: string | null;
  form_url: string;
}

export interface HomeMatch extends Match {
  is_live: boolean;
  is_turkey_match: boolean;
}

export interface HomeResponse {
  featured_match: HomeMatch | null;
  today_matches: HomeMatch[];
  turkey_next_match: HomeMatch | null;
}

export interface GroupPrediction {
  group_name: string;
  r1: string | null;
  r2: string | null;
  r3: string | null;
  r4: string | null;
}

export interface ParticipantFullPredictions {
  name: string;
  groups: GroupPrediction[];
}
