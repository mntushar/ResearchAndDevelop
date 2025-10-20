import { anotherHelper, doSomeThing } from "./dependency";
import { WorkerPool } from "./worker";

// Heartbeat to monitor main thread
// function monitorMainThread(interval = 100) {
//     let last = performance.now();
//     setInterval(() => {
//         const now = performance.now();
//         const delay = now - last - interval;
//         if (delay > 50) {
//             console.log(`⚠️ Main thread blocked for ${delay.toFixed(2)} ms`);
//         }
//         last = now;
//     }, interval);
// }

// monitorMainThread(); // start monitoring

// // example without dependency
// (async () => {
//     const size = 1e9;
//     const pool = new WorkerPool();
//     const result = await pool.executeTask<number>(
//         (data: number) => {
//             let sum = 0;
//             for (let i = 0; i < data; i++) sum += i;
//             return sum;
//         },
//         {},
//         [size]
//     );
//     console.log("Worker result:", result);
// })();

// // example with dependency
// (async () => {
//     const size = 1e9;
//     const pool = new WorkerPool();
//     const result = await pool.executeTask<number>(
//         (doSomeThing, anotherHelper, data) => {
//             let sum = 0;
//             for (let i = 0; i < data; i++) sum += i;
//             const processed = doSomeThing(sum);
//             return anotherHelper(processed);
//         },
//         { doSomeThing, anotherHelper }, // Dependencies to inject
//         [size], // Regular arguments
//     );

//     console.log("Worker result:", result);
// })();

// // example with module dependency
// (async () => {
//     const size = 1e9;
//     const pool = new WorkerPool();

//     const result = await pool.executeTask<number>(
//         (fs, doSomeThing, anotherHelper, data) => {
//             return new Promise((resolve, reject) => {
//                 let sum = 0;
//                 for (let i = 0; i < data; i++) sum += i;
//                 const processed = doSomeThing(sum);
//                 sum = anotherHelper(processed);

//                 fs.writeFileSync('result.txt', `Worker result: ${sum}\n`, 'utf8');

//                 resolve(sum);
//             });
//         },
//         { fs: 'fs', doSomeThing, anotherHelper }, // Dependencies to inject
//         [size], // Regular arguments
//     );

//     console.log("Worker result:", result);
// })();
