import { parentPort } from 'node:worker_threads';

parentPort.on('message', async ({ scriptPath, task }) => {
  try {
    const module = await import(scriptPath); // dynamically import script
    if (typeof module.default !== 'function') {
      throw new Error(`Script ${scriptPath} must export default function`);
    }
    const result = await module.default(task);
    parentPort.postMessage(result);
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
});
