export type AdminLoginReason =
  | 'session_invalid'
  | 'api_unavailable';

export function adminLoginReasonMessage(
  reason: AdminLoginReason | string | undefined
): string | null {
  switch (reason) {
    case 'session_invalid':
      return 'Your session expired or is no longer valid. Please sign in again.';
    case 'api_unavailable':
      return 'Could not reach the Waterstone API. Make sure it is running (localhost:5000 in development).';
    default:
      return null;
  }
}

export function formatLoginApiError(message?: string): string {
  if (!message) return 'Login failed. Check your email and password.';

  const lower = message.toLowerCase();
  if (
    lower.includes('admin') ||
    lower.includes('post /api/admins') ||
    lower.includes('no autorizado')
  ) {
    return 'This account is not registered as an admin. Create the user via Users (if you have access) or POST /api/admins with bootstrap.';
  }
  if (lower.includes('incorrect') || lower.includes('credenciales')) {
    return 'Incorrect email or password.';
  }
  if (lower.includes('client token')) {
    return 'Server configuration error (client token). Contact support.';
  }

  return message;
}
