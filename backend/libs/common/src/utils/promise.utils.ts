export function mapPromisesFullfilledToErrorResult<
  T = any,
  E extends Error = Error,
>(
  promises: PromiseSettledResult<T>[],
): {
  results: T[]
  errors: E[]
} {
  const results: T[] = []
  const errors: E[] = []
  for (const promise of promises) {
    if (promise.status === 'fulfilled') {
      results.push(promise.value)
    } else {
      errors.push(promise.reason)
    }
  }
  return {
    results,
    errors,
  }
}
