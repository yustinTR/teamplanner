import { vi } from "vitest";
import * as a11yAddonAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from '@storybook/nextjs-vite';
import * as projectAnnotations from './preview';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);

// --- Shared noop mutation used across all hook mocks ---

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
};

// --- Mock Supabase client so hooks don't make real API calls ---

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
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
  }),
}));

// --- Mock hooks that make Supabase calls ---
// Each organism uses hooks from @/hooks/use-*. We mock all of them
// to return stable data so stories can render without a database.
// vi.mock factory functions are hoisted, so we use async dynamic imports.

vi.mock("@/hooks/use-players", async () => {
  const { MOCK_PLAYERS } = await import("@/lib/test/mock-data");
  return {
    usePlayers: () => ({ data: MOCK_PLAYERS, isLoading: false, isError: false, error: null }),
    usePlayer: () => ({ data: MOCK_PLAYERS[0], isLoading: false, isError: false, error: null }),
    useCreatePlayer: () => noopMutation,
    useUpdatePlayer: () => noopMutation,
    useDeactivatePlayer: () => noopMutation,
  };
});

vi.mock("@/hooks/use-matches", async () => {
  const { MOCK_MATCHES } = await import("@/lib/test/mock-data");
  return {
    useMatches: () => ({ data: MOCK_MATCHES, isLoading: false, isError: false, error: null }),
    useMatch: () => ({ data: MOCK_MATCHES[0], isLoading: false, isError: false, error: null }),
    useCreateMatch: () => noopMutation,
    useUpdateMatch: () => noopMutation,
    useCancelMatch: () => noopMutation,
  };
});

vi.mock("@/hooks/use-availability", async () => {
  const { MOCK_AVAILABILITY } = await import("@/lib/test/mock-data");
  return {
    useAvailability: () => ({ data: MOCK_AVAILABILITY, isLoading: false, isError: false, error: null }),
    useSetAvailability: () => noopMutation,
    useAvailabilityRealtime: () => {},
  };
});

vi.mock("@/hooks/use-lineup", () => ({
  useLineup: () => ({ data: null, isLoading: false, isError: false, error: null }),
  useSaveLineup: () => noopMutation,
}));

vi.mock("@/hooks/use-team", async () => {
  const { MOCK_TEAM } = await import("@/lib/test/mock-data");
  return {
    useTeam: () => ({ data: MOCK_TEAM, isLoading: false, isError: false, error: null }),
    useCreateTeam: () => noopMutation,
    useUpdateTeam: () => noopMutation,
  };
});
