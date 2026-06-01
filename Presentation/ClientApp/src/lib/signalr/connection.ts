import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

const DEFAULT_HUB_URL = '/chesshub';

export function getHubUrl(): string {
  const fromEnv = import.meta.env.VITE_HUB_URL;
  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : DEFAULT_HUB_URL;
}

export function createConnection(url: string = getHubUrl()): HubConnection {
  return new HubConnectionBuilder()
    .withUrl(url)
    .withAutomaticReconnect()
    .configureLogging(import.meta.env.DEV ? LogLevel.Information : LogLevel.Warning)
    .build();
}

export { HubConnectionState };
