

export function setSession(token: string) {
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function removeSession() {
  document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
} 