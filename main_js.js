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
    const task = { a: 5, b: 5 };
    var resultAdd = await pool.runTask('./addition.js', { iterations: 5_000_000 });
    console.log(resultAdd);

    const resultMulti = await pool.runTask('./multi.js', task);
    console.log(resultMulti);

    await pool.runTask('./invoice_pdf_final.js', null);

    resultAdd = await pool.runTask('./addition.js', { iterations: 5_000_000 });
    console.log(resultAdd);
})();

