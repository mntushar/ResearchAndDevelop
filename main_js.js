import { pool } from "./worker/worker_thread";


(async () => {
    const task = { a: 5, b: 5 };
    const result = 0;
    await pool.runTask('./addition.js', task, (err, result) => {
        console.log(`✅result:`, result);
        result = result;
    });

    console.log(`✅result:`, result);
    console.log('ok');
})();