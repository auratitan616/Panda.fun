function parseConfigEnv(env: Record<string, string | undefined>) {
  const value = (key: string, fallback: string) => env[key] ?? fallback;
  const number = (key: string, fallback: number, max = Number.MAX_SAFE_INTEGER) => {
    const parsed = Number(value(key, String(fallback)));
    if (!Number.isInteger(parsed) || parsed <= 0 || parsed > max) throw new Error(`Invalid positive integer for ${key}`);
    return parsed;
  };
  const url = (key: string, fallback: string) => {
    const candidate = value(key, fallback);
    try { new URL(candidate); } catch { throw new Error(`Invalid URL for ${key}`); }
    return candidate;
  };
  const userAgent = value("MOVIEAPI_TVMAZE_USER_AGENT", "MovieApi/0.9.0 (Panda.fun)");
  const moviePath = value("MOVIEAPI_VIDY_MOVIE_PATH", "/movie/{tmdbId}");
  const tvPath = value("MOVIEAPI_VIDY_TV_PATH", "/tv/{tmdbId}/{season}/{episode}");
  const corsOrigin = value("MOVIEAPI_CORS_ORIGIN", "*");
  if (!userAgent.trim() || !moviePath || !tvPath || !corsOrigin) throw new Error("Invalid empty configuration value");
  return {
    MOVIEAPI_API_KEYS: value("MOVIEAPI_API_KEYS", ""),
    MOVIEAPI_AUTH_REQUIRED: value("MOVIEAPI_AUTH_REQUIRED", "false").toLowerCase() === "true",
    MOVIEAPI_RATE_LIMIT: number("MOVIEAPI_RATE_LIMIT", 120),
    MOVIEAPI_RATE_WINDOW_MS: number("MOVIEAPI_RATE_WINDOW_MS", 60_000),
    MOVIEAPI_TVMAZE_BASE_URL: url("MOVIEAPI_TVMAZE_BASE_URL", "https://api.tvmaze.com"),
    MOVIEAPI_TVMAZE_USER_AGENT: userAgent,
    MOVIEAPI_TVMAZE_TIMEOUT_MS: number("MOVIEAPI_TVMAZE_TIMEOUT_MS", 8_000, 30_000),
    MOVIEAPI_TMDB_ACCESS_TOKEN: value("MOVIEAPI_TMDB_ACCESS_TOKEN", ""),
    MOVIEAPI_TMDB_BASE_URL: url("MOVIEAPI_TMDB_BASE_URL", "https://api.themoviedb.org/3"),
    MOVIEAPI_TMDB_TIMEOUT_MS: number("MOVIEAPI_TMDB_TIMEOUT_MS", 8_000, 30_000),
    MOVIEAPI_VIDY_BASE_URL: url("MOVIEAPI_VIDY_BASE_URL", "https://www.vidy.st"),
    MOVIEAPI_VIDY_MOVIE_PATH: moviePath,
    MOVIEAPI_VIDY_TV_PATH: tvPath,
    MOVIEAPI_CORS_ORIGIN: corsOrigin,
    PORT: number("PORT", 3000)
  };
}

export type Config = {
  apiKeys: Set<string>;
  authRequired: boolean;
  rateLimit: number;
  rateWindowMs: number;
  tvmaze: {
    baseUrl: string;
    userAgent: string;
    timeoutMs: number;
  };
  tmdb: {
    accessToken?: string;
    baseUrl: string;
    timeoutMs: number;
  };
  vidy: {
    baseUrl: string;
    moviePath: string;
    tvPath: string;
  };
  corsOrigin: string;
  port: number;
};

export function loadConfig(env: Record<string, string | undefined> = process.env): Config {
  const parsed = parseConfigEnv(env);
  const apiKeys = new Set(parsed.MOVIEAPI_API_KEYS.split(",").map((v) => v.trim()).filter(Boolean));

  if (parsed.MOVIEAPI_AUTH_REQUIRED && apiKeys.size === 0) {
    throw new Error("MOVIEAPI_AUTH_REQUIRED=true requires at least one API key");
  }

  return {
    apiKeys,
    authRequired: parsed.MOVIEAPI_AUTH_REQUIRED,
    rateLimit: parsed.MOVIEAPI_RATE_LIMIT,
    rateWindowMs: parsed.MOVIEAPI_RATE_WINDOW_MS,
    tvmaze: {
      baseUrl: parsed.MOVIEAPI_TVMAZE_BASE_URL,
      userAgent: parsed.MOVIEAPI_TVMAZE_USER_AGENT,
      timeoutMs: parsed.MOVIEAPI_TVMAZE_TIMEOUT_MS
    },
    tmdb: {
      accessToken: parsed.MOVIEAPI_TMDB_ACCESS_TOKEN || undefined,
      baseUrl: parsed.MOVIEAPI_TMDB_BASE_URL,
      timeoutMs: parsed.MOVIEAPI_TMDB_TIMEOUT_MS
    },
    vidy: {
      baseUrl: parsed.MOVIEAPI_VIDY_BASE_URL,
      moviePath: parsed.MOVIEAPI_VIDY_MOVIE_PATH,
      tvPath: parsed.MOVIEAPI_VIDY_TV_PATH
    },
    corsOrigin: parsed.MOVIEAPI_CORS_ORIGIN,
    port: parsed.PORT
  };
}
