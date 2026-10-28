export function getApiErrorMessage(error: any, fallback: string): string {
  if (!error) {
    return fallback;
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return error.error;
  }

  if (error.error?.message) {
    return error.error.message;
  }

  if (error.error?.title && error.error?.errors) {
    const validationMessages = Object.values(error.error.errors).reduce<string[]>((messages, group) => {
      if (Array.isArray(group)) {
        group.forEach(value => {
          if (typeof value === 'string' && value.trim().length > 0) {
            messages.push(value);
          }
        });
      }

      return messages;
    }, []);

    if (validationMessages.length > 0) {
      return validationMessages.join(' ');
    }

    return error.error.title;
  }

  if (error.status === 0) {
    return 'Khong the ket noi toi may chu backend.';
  }

  return fallback;
}
