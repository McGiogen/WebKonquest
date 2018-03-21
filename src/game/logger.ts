import structuredLog from 'structured-log';

export const log = structuredLog.configure()
    .writeTo(new structuredLog.ConsoleSink())
    .create();