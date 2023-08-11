export function isTokenExpired(token: string): boolean {
  const decoded = JSON.parse(atob(token.split('.')[1]))
  return decoded.exp < Date.now() / 1000
}
