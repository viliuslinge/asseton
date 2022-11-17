export function generateNonce(): string {
  return (Date.now() * 1000).toString();
}
