import { pool } from "./worker/worker_thread.mjs";


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
  // example for file
  let resultAdd;
  const task = { a: 5, b: 5 };
  resultAdd = await pool.runTaskScriptPath('./addition.js', task);
  console.log(resultAdd);


  // example for code excute
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
  const codes = pool.functionToString(codef, codef.name);
  resultAdd = await pool.runTaskScriptCode(codes, { iterations: 5_000_000 });
  console.log(resultAdd);

  // example for code excute with dependency
  const codefd = (data, dependencies) => {
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

    const aTask = { a: results.length, b: 5 };
    return dependencies['addition'].default(aTask);
  };
  const codesd = pool.functionToString(codefd, codefd.name);
  const iterations = 5_000_000;
  const data = { iterations, dependencyPaths: ['./addition.js'] };
  resultAdd = await pool.runTaskScriptCode(codesd, data);
  console.log(resultAdd);
})();