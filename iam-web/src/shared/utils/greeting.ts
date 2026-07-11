export function getTimeBasedGreeting(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour >= 5 && hour < 18) return 'Bonjour'
  return 'Bonsoir'
}
