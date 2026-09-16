import { vi, type Mock } from "vitest";

export interface MockResult {
  data: unknown;
  error: unknown;
}

/**
 * Chainable, thenable mock of a Supabase query builder. Every builder
 * method returns the builder itself; awaiting it resolves to `result`.
 */
export interface MockQueryBuilder extends PromiseLike<MockResult> {
  select: Mock;
  eq: Mock;
  order: Mock;
  single: Mock;
  maybeSingle: Mock;
  insert: Mock;
  upsert: Mock;
  update: Mock;
  delete: Mock;
  in: Mock;
  limit: Mock;
}

export function createMockQueryBuilder(result: MockResult): MockQueryBuilder {
  const builder = {} as Record<string, unknown>;
  const methods = [
    "select",
    "eq",
    "order",
    "single",
    "maybeSingle",
    "insert",
    "upsert",
    "update",
    "delete",
    "in",
    "limit",
  ];
  for (const method of methods) {
    builder[method] = vi.fn(() => builder);
  }
  builder.then = (
    resolve: (value: MockResult) => unknown,
    reject?: (reason: unknown) => unknown
  ) => Promise.resolve(result).then(resolve, reject);
  return builder as unknown as MockQueryBuilder;
}

/**
 * Mock Supabase client whose `from()` returns queued builders in order
 * (one per query). Also stubs the realtime channel API.
 */
export function createMockSupabase(...results: MockResult[]) {
  const builders = results.map(createMockQueryBuilder);
  let call = 0;
  const channel = {
    on: vi.fn(function (this: unknown) {
      return channel;
    }),
    subscribe: vi.fn(() => channel),
  };
  const client = {
    from: vi.fn(() => {
      const builder = builders[Math.min(call, builders.length - 1)];
      call += 1;
      return builder;
    }),
    channel: vi.fn(() => channel),
    removeChannel: vi.fn(),
  };
  return { client, builders, channel };
}
