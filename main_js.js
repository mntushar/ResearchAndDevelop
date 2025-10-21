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

const task = { a: 5, b: 5 };
pool.runTask('./addition.js', task, (err, result) => {
    console.log(`✅result:`, result);
});


pool.runTask('./multi.js', task, (err, result) => {
    console.log(`✅result multi:`, result);
});

pool.runTask('./invoice_pdf_final.js', null, (err, result) => {
    if(err)
        console.log(`✅pdf error:`, err);
    else
        console.log(`✅pdf: PDF created successfully`);
});

