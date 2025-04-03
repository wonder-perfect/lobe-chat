import { DevtoolsDispatchEvents } from './devtools';
import { MenuDispatchEvents } from './menu';
import { FilesSearchDispatchEvents } from './search';
import { SystemDispatchEvents } from './system';

/**
 * renderer -> main dispatch events
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientDispatchEvents
  extends DevtoolsDispatchEvents,
    FilesSearchDispatchEvents,
    SystemDispatchEvents,
    MenuDispatchEvents {}

export type ClientDispatchEventKey = keyof ClientDispatchEvents;

export type ClientEventReturnType<T extends ClientDispatchEventKey> = ReturnType<
  ClientDispatchEvents[T]
>;
