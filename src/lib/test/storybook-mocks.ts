/**
 * Hook mock implementations for Storybook vitest tests.
 * These are used in .storybook/vitest.setup.ts via vi.mock().
 */
import {
  MOCK_PLAYERS,
  MOCK_MATCHES,
  MOCK_AVAILABILITY,
  MOCK_TEAM,
  createMockLineup,
} from "./mock-data";

// --- Shared noop mutation ---

const noopMutation = {
  mutate: () => {},
  mutateAsync: async () => ({}),
  isPending: false,
  isError: false,
  isSuccess: false,
  isIdle: true,
  error: null,
  data: undefined,
  reset: () => {},
  variables: undefined,
  status: "idle" as const,
  failureCount: 0,
  failureReason: null,
  context: undefined,
  submittedAt: 0,
  isPaused: false,
};

// --- use-players mock ---

export const mockUsePlayers = () => ({
  data: MOCK_PLAYERS,
  isLoading: false,
  isError: false,
  error: null,
});

export const mockUsePlayer = () => ({
  data: MOCK_PLAYERS[0],
  isLoading: false,
  isError: false,
  error: null,
});

export const mockUseCreatePlayer = () => noopMutation;
export const mockUseUpdatePlayer = () => noopMutation;
export const mockUseDeactivatePlayer = () => noopMutation;

// --- use-matches mock ---

export const mockUseMatches = () => ({
  data: MOCK_MATCHES,
  isLoading: false,
  isError: false,
  error: null,
});

export const mockUseMatch = () => ({
  data: MOCK_MATCHES[0],
  isLoading: false,
  isError: false,
  error: null,
});

export const mockUseCreateMatch = () => noopMutation;
export const mockUseUpdateMatch = () => noopMutation;
export const mockUseCancelMatch = () => noopMutation;

// --- use-availability mock ---

export const mockUseAvailability = () => ({
  data: MOCK_AVAILABILITY,
  isLoading: false,
  isError: false,
  error: null,
});

export const mockUseSetAvailability = () => noopMutation;
export const mockUseAvailabilityRealtime = () => {};

// --- use-lineup mock ---

export const mockUseLineup = () => ({
  data: createMockLineup(),
  isLoading: false,
  isError: false,
  error: null,
});

export const mockUseSaveLineup = () => noopMutation;

// --- use-team mock ---

export const mockUseTeam = () => ({
  data: MOCK_TEAM,
  isLoading: false,
  isError: false,
  error: null,
});

export const mockUseCreateTeam = () => noopMutation;
export const mockUseUpdateTeam = () => noopMutation;

// --- Supabase client mock ---

export const mockCreateClient = () => ({
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: async () => ({ data: [], error: null }),
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          order: async () => ({ data: [], error: null }),
        }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
    upsert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
  }),
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  channel: () => ({
    on: () => ({
      subscribe: () => ({}),
    }),
  }),
  removeChannel: () => {},
});
