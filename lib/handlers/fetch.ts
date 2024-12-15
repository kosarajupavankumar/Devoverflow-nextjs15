import { ActionResponse } from '@/types/global';

import { RequestError } from '../http-errors';
import logger from '../logger';
import handleError from './error';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders };
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  logger.info(`Request URL: ${url}`);
  logger.info(`Request options: ${JSON.stringify(config)}`);

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    logger.info(`Response status: ${response.status}`);
    const responseBody = await response.json();
    logger.info(`Response body: ${JSON.stringify(responseBody)}`);

    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    }

    return responseBody;
  } catch (err) {
    const error = isError(err) ? err : new Error('Unknown error');

    if (error.name === 'AbortError') {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
}
