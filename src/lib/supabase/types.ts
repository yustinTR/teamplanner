export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      availability: {
        Row: {
          id: string
          match_id: string
          player_id: string
          responded_at: string
          status: Database["public"]["Enums"]["availability_status"]
        }
        Insert: {
          id?: string
          match_id: string
          player_id: string
          responded_at?: string
          status: Database["public"]["Enums"]["availability_status"]
        }
        Update: {
          id?: string
          match_id?: string
          player_id?: string
          responded_at?: string
          status?: Database["public"]["Enums"]["availability_status"]
        }
        Relationships: [
          {
            foreignKeyName: "availability_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availability_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          event_id: string
          id: string
          player_id: string
          responded_at: string
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Insert: {
          event_id: string
          id?: string
          player_id: string
          responded_at?: string
          status: Database["public"]["Enums"]["attendance_status"]
        }
        Update: {
          event_id?: string
          id?: string
          player_id?: string
          responded_at?: string
          status?: Database["public"]["Enums"]["attendance_status"]
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tasks: {
        Row: {
          assigned_to: string | null
          created_at: string
          deadline: string | null
          description: string | null
          event_id: string
          id: string
          is_done: boolean
          title: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          event_id: string
          id?: string
          is_done?: boolean
          title: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          event_id?: string
          id?: string
          is_done?: boolean
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          location: string | null
          notes: string | null
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          location?: string | null
          notes?: string | null
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          location?: string | null
          notes?: string | null
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          category: Database["public"]["Enums"]["exercise_category"]
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["exercise_difficulty"]
          duration_minutes: number
          id: string
          is_published: boolean
          max_players: number | null
          min_players: number | null
          setup_instructions: string | null
          team_types: string[] | null
          title: string
          updated_at: string
          variations: string | null
          video_url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["exercise_category"]
          created_at?: string
          description: string
          difficulty?: Database["public"]["Enums"]["exercise_difficulty"]
          duration_minutes: number
          id?: string
          is_published?: boolean
          max_players?: number | null
          min_players?: number | null
          setup_instructions?: string | null
          team_types?: string[] | null
          title: string
          updated_at?: string
          variations?: string | null
          video_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["exercise_category"]
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["exercise_difficulty"]
          duration_minutes?: number
          id?: string
          is_published?: boolean
          max_players?: number | null
          min_players?: number | null
          setup_instructions?: string | null
          team_types?: string[] | null
          title?: string
          updated_at?: string
          variations?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      lineups: {
        Row: {
          created_at: string
          formation: string
          id: string
          match_id: string
          positions: Json
          substitution_plan: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          formation?: string
          id?: string
          match_id: string
          positions?: Json
          substitution_plan?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          formation?: string
          id?: string
          match_id?: string
          positions?: Json
          substitution_plan?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lineups_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_players: {
        Row: {
          created_at: string
          id: string
          match_id: string
          name: string
          primary_position: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          name: string
          primary_position?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          name?: string
          primary_position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_players_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_stats: {
        Row: {
          assists: number
          created_at: string
          goals: number
          id: string
          match_id: string
          player_id: string
          red_cards: number
          updated_at: string
          yellow_cards: number
        }
        Insert: {
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          match_id: string
          player_id: string
          red_cards?: number
          updated_at?: string
          yellow_cards?: number
        }
        Update: {
          assists?: number
          created_at?: string
          goals?: number
          id?: string
          match_id?: string
          player_id?: string
          red_cards?: number
          updated_at?: string
          yellow_cards?: number
        }
        Relationships: [
          {
            foreignKeyName: "match_stats_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_stats_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          gathering_time: string | null
          home_away: Database["public"]["Enums"]["home_away"]
          id: string
          location: string | null
          match_date: string
          notes: string | null
          opponent: string
          score_away: number | null
          score_home: number | null
          status: Database["public"]["Enums"]["match_status"]
          team_id: string
          travel_time_minutes: number | null
        }
        Insert: {
          created_at?: string
          gathering_time?: string | null
          home_away?: Database["public"]["Enums"]["home_away"]
          id?: string
          location?: string | null
          match_date: string
          notes?: string | null
          opponent: string
          score_away?: number | null
          score_home?: number | null
          status?: Database["public"]["Enums"]["match_status"]
          team_id: string
          travel_time_minutes?: number | null
        }
        Update: {
          created_at?: string
          gathering_time?: string | null
          home_away?: Database["public"]["Enums"]["home_away"]
          id?: string
          location?: string | null
          match_date?: string
          notes?: string | null
          opponent?: string
          score_away?: number | null
          score_home?: number | null
          status?: Database["public"]["Enums"]["match_status"]
          team_id?: string
          travel_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      players: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          jersey_number: number | null
          name: string
          notes: string | null
          photo_url: string | null
          primary_position: string | null
          role: string
          secondary_positions: string[]
          skills: Json | null
          team_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          jersey_number?: number | null
          name: string
          notes?: string | null
          photo_url?: string | null
          primary_position?: string | null
          role?: string
          secondary_positions?: string[]
          skills?: Json | null
          team_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          jersey_number?: number | null
          name?: string
          notes?: string | null
          photo_url?: string | null
          primary_position?: string | null
          role?: string
          secondary_positions?: string[]
          skills?: Json | null
          team_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          club_name: string | null
          created_at: string
          created_by: string
          default_gathering_minutes: number
          formation: string | null
          home_address: string | null
          id: string
          import_club_abbrev: string | null
          import_team_id: number | null
          import_team_name: string | null
          import_team_url: string | null
          invite_code: string
          logo_url: string | null
          name: string
          team_type: Database["public"]["Enums"]["team_type"]
          updated_at: string
        }
        Insert: {
          club_name?: string | null
          created_at?: string
          created_by: string
          default_gathering_minutes?: number
          formation?: string | null
          home_address?: string | null
          id?: string
          import_club_abbrev?: string | null
          import_team_id?: number | null
          import_team_name?: string | null
          import_team_url?: string | null
          invite_code?: string
          logo_url?: string | null
          name: string
          team_type?: Database["public"]["Enums"]["team_type"]
          updated_at?: string
        }
        Update: {
          club_name?: string | null
          created_at?: string
          created_by?: string
          default_gathering_minutes?: number
          formation?: string | null
          home_address?: string | null
          id?: string
          import_club_abbrev?: string | null
          import_team_id?: number | null
          import_team_name?: string | null
          import_team_url?: string | null
          invite_code?: string
          logo_url?: string | null
          name?: string
          team_type?: Database["public"]["Enums"]["team_type"]
          updated_at?: string
        }
        Relationships: []
      }
      training_plan_exercises: {
        Row: {
          exercise_id: string
          id: string
          plan_id: string
          sort_order: number
        }
        Insert: {
          exercise_id: string
          id?: string
          plan_id: string
          sort_order: number
        }
        Update: {
          exercise_id?: string
          id?: string
          plan_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "training_plan_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plan_exercises_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "training_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      training_plans: {
        Row: {
          created_at: string
          created_by: string
          event_id: string | null
          id: string
          notes: string | null
          team_id: string
          title: string
          total_duration_minutes: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          event_id?: string | null
          id?: string
          notes?: string | null
          team_id: string
          title: string
          total_duration_minutes?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          event_id?: string | null
          id?: string
          notes?: string | null
          team_id?: string
          title?: string
          total_duration_minutes?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_plans_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_plans_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_team_ids: { Args: never; Returns: string[] }
      join_team_by_invite_code: {
        Args: { invite_code_input: string; user_name: string }
        Returns: Json
      }
    }
    Enums: {
      attendance_status: "coming" | "not_coming" | "maybe"
      availability_status: "available" | "unavailable" | "maybe"
      exercise_category:
        | "warming_up"
        | "passing"
        | "positiespel"
        | "verdedigen"
        | "aanvallen"
        | "conditie"
        | "afwerken"
      exercise_difficulty: "basis" | "gemiddeld" | "gevorderd"
      home_away: "home" | "away"
      match_status: "upcoming" | "completed" | "cancelled"
      team_type:
        | "senioren"
        | "jo19_jo17"
        | "jo15_jo13"
        | "jo11_jo9"
        | "g_team"
        | "jo19_jo15"
        | "jo13_jo11"
        | "jo9_jo7"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      attendance_status: ["coming", "not_coming", "maybe"],
      availability_status: ["available", "unavailable", "maybe"],
      exercise_category: [
        "warming_up",
        "passing",
        "positiespel",
        "verdedigen",
        "aanvallen",
        "conditie",
        "afwerken",
      ],
      exercise_difficulty: ["basis", "gemiddeld", "gevorderd"],
      home_away: ["home", "away"],
      match_status: ["upcoming", "completed", "cancelled"],
      team_type: [
        "senioren",
        "jo19_jo17",
        "jo15_jo13",
        "jo11_jo9",
        "g_team",
        "jo19_jo15",
        "jo13_jo11",
        "jo9_jo7",
      ],
    },
  },
} as const
