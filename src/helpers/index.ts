export const safeParseJSON = <T>(value: string, defaultValue: T): T => {
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
};
