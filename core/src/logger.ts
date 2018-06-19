import * as structuredLog from 'structured-log';

export const log = structuredLog.configure()
  .writeTo(new structuredLog.ConsoleSink())
  .minLevel.debug()
  .create();
