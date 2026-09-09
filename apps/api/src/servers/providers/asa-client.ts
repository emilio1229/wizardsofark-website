export class AsaFetchError extends Error {
  readonly causeDetail: unknown;

  constructor(message: string, causeDetail?: unknown) {
    super(message);
    this.name = 'AsaFetchError';
    this.causeDetail = causeDetail;
  }
}

export type AsaClientOptions = {
  url: string;
  timeoutMs: number;
  fetchImpl?: typeof fetch;
};

export async function fetchAsaUnofficialServerList(
  options: AsaClientOptions,
): Promise<unknown> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs);

  try {
    const response = await fetchImpl(options.url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'WizardsOfArk-ServerMonitor/1.0',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new AsaFetchError(`ASA server list HTTP ${response.status}`);
    }

    const text = await response.text();
    if (!text.trim()) {
      throw new AsaFetchError('ASA server list returned an empty body');
    }

    try {
      return JSON.parse(text) as unknown;
    } catch (error) {
      throw new AsaFetchError('ASA server list returned invalid JSON', error);
    }
  } catch (error) {
    if (error instanceof AsaFetchError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AsaFetchError(
        `ASA server list request timed out after ${options.timeoutMs}ms`,
      );
    }
    throw new AsaFetchError(
      error instanceof Error ? error.message : 'ASA server list request failed',
      error,
    );
  } finally {
    clearTimeout(timer);
  }
}
