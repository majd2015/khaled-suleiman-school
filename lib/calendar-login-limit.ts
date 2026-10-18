/** A bounded, per-client fixed window. Reserve before hashing to cover concurrent attempts. */
export class LoginLimiter {
  private buckets = new Map<string, { count: number; expires: number }>();
  private limit: number;
  private windowMs: number;
  private capacity: number;
  constructor(limit = 10, windowMs = 60_000, capacity = 10_000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.capacity = capacity;
  }

  consume(key: string, now = Date.now()) {
    for (const [id, bucket] of this.buckets) {
      if (bucket.expires <= now) this.buckets.delete(id);
    }
    let bucket = this.buckets.get(key);
    if (!bucket) {
      if (this.buckets.size >= this.capacity)
        this.buckets.delete(this.buckets.keys().next().value!);
      bucket = { count: 0, expires: now + this.windowMs };
      this.buckets.set(key, bucket);
    }
    const retryAfter = Math.max(1, Math.ceil((bucket.expires - now) / 1000));
    if (bucket.count >= this.limit) return { allowed: false, retryAfter };
    bucket.count += 1;
    return { allowed: true, retryAfter: 0 };
  }

  clear(key: string) {
    this.buckets.delete(key);
  }
}

export const calendarLoginLimiter = new LoginLimiter();
