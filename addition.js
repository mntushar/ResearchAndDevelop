// heavyTask.js
export default function heavyTask(task) {
  const results = [];

  function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) return false;
    }
    return true;
  }

  // CPU-intensive loop
  for (let i = 2; i < task.iterations; i++) {
    if (isPrime(i)) {
      results.push(i);
    }
  }

  return results.length; // number of primes found
}
