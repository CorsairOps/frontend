export function mapBadRequestToErrorsObject(badRequestData: unknown, fields: string[]): Record<string, string> {

  const errors: Record<string, string> = {};
  for (const field of fields) {
    errors[field] = "";
  }

  if (!Array.isArray(badRequestData)) {
    return errors;
  }

  badRequestData.forEach((err) => {
    if (fields.includes(err.field)) {
      errors[err.field] = err.defaultMessage;
    }
  });

  return errors;
}