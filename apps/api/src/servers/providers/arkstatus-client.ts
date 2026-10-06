export class ArkStatusFetchError extends Error {
  readonly causeDetail: unknown;

  constructor(message: string, causeDetail?: unknown) {
    super(message);
    this.name = "ArkStatusFetchError";
    this.causeDetail = causeDetail;
  }
}

export type ArkStatusClientOptions = {
  baseUrl: string;
  apiKey: string;
  /** Optional server-name search term, passed to the API's `search` param. */
  search?: string;
  timeoutMs: number;
  fetchImpl?: typeof fetch;
};

/**
 * Fetch a page of servers from the ARK Status API.
 *
 * This endpoint requires an API key and wraps results in a
 * `{ success, data, meta }` envelope. The raw envelope is returned unparsed so
 * the caller can apply the provider's parser.
 */
export async function fetchArkStatusServerList(
  options: ArkStatusClientOptions,
): Promise<unknown> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);

  const base = options.baseUrl.replace(/\/+$/, "");
  const url = new URL(`${base}/servers`);
  if (options.search && options.search.trim()) {
    url.searchParams.set("search", options.search.trim());
  }

  try {
    const response = await fetchImpl(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-API-Key": options.apiKey,
        "User-Agent": "WizardsOfArk-ServerMonitor/1.0",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new ArkStatusFetchError(
        `ARK Status server list HTTP ${response.status}`,
      );
    }

    const text = await response.text();
    if (!text.trim()) {
      throw new ArkStatusFetchError(
        "ARK Status server list returned an empty body",
      );
    }

    try {
      return JSON.parse(text) as unknown;
    } catch (error) {
      throw new ArkStatusFetchError(
        "ARK Status server list returned invalid JSON",
        error,
      );
    }
  } catch (error) {
    if (error instanceof ArkStatusFetchError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new ArkStatusFetchError(
        `ARK Status server list request timed out after ${options.timeoutMs}ms`,
      );
    }
    throw new ArkStatusFetchError(
      error instanceof Error
        ? error.message
        : "ARK Status server list request failed",
      error,
    );
  } finally {
    clearTimeout(timer);
  }
}
