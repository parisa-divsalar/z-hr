export function trackEvent(eventName: string, payload?: Record<string, any>) {
  if (typeof window === 'undefined') return;

  console.log(`[Analytics] ${eventName}`, payload);

  // TODO: Send to backend analytics service
  // fetch('/api/user-states/log', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ event: eventName, ...payload }),
  // }).catch(err => console.error('Analytics error:', err));
}
