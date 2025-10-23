import { pool } from "./worker/worker_thread";


// Heartbeat to monitor main thread
function monitorMainThread(interval = 100) {
  let last = performance.now();
  setInterval(() => {
    const now = performance.now();
    const delay = now - last - interval;
    if (delay > 50) {
      console.log(`⚠️ Main thread blocked for ${delay.toFixed(2)} ms`);
    }
    last = now;
  }, interval);
}

monitorMainThread();

(async () => {
  let resultAdd;
  const task = { a: 5, b: 5 };
  resultAdd = await pool.runTaskScriptPath('./addition.js', { iterations: 5_000_000 });
  console.log(resultAdd);

  const resultMulti = await pool.runTaskScriptPath('./multi.js', task);
  console.log(resultMulti);

  await pool.runTaskScriptPath('./invoice_pdf_run.js', null);

  const codef = (task) => {
    const results = [];

    function isPrime(n) {
      if (n < 2) return false;
      for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
      }
      return true;
    }

    for (let i = 2; i < task.iterations; i++) {
      if (isPrime(i)) results.push(i);
    }

    return results.length;
  };

  const codes = `
  const fn = ${codef.toString()};
  return fn(task);
`;

  resultAdd = await pool.runTaskScriptCode(codes, { iterations: 5_000_000 });
  console.log(resultAdd);
})();