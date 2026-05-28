export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          emoji: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          emoji: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          emoji?: string;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      daily_goals: {
        Row: {
          id: string;
          user_id: string;
          calories_target: number;
          protein_target: number;
          fibre_target: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          calories_target?: number;
          protein_target?: number;
          fibre_target?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          calories_target?: number;
          protein_target?: number;
          fibre_target?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_goals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      lock_in: {
        Row: {
          id: number;
          start_date: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          start_date: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          start_date?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      daily_weights: {
        Row: {
          user_id: string;
          date: string;
          weight: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          weight: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          date?: string;
          weight?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_weights_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      entries: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          meal_name: string | null;
          calories: number | null;
          protein: number | null;
          fibre: number | null;
          calories_burnt: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          meal_name?: string | null;
          calories?: number | null;
          protein?: number | null;
          fibre?: number | null;
          calories_burnt?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          meal_name?: string | null;
          calories?: number | null;
          protein?: number | null;
          fibre?: number | null;
          calories_burnt?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "entries_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience types
export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type GoalsRow = Database["public"]["Tables"]["daily_goals"]["Row"];
export type EntryRow = Database["public"]["Tables"]["entries"]["Row"];
export type DailyWeightRow = Database["public"]["Tables"]["daily_weights"]["Row"];
export type LockInRow = Database["public"]["Tables"]["lock_in"]["Row"];

export type EntryInput = {
  meal_name?: string | null;
  calories?: number | null;
  protein?: number | null;
  fibre?: number | null;
  calories_burnt?: number | null;
};

export type GoalInput = {
  calories_target: number;
  protein_target: number;
  fibre_target: number;
};

export type WeightInput = {
  weight: number;
};
