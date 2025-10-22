import { parentPort } from 'node:worker_threads';
import { pathToFileURL } from 'node:url';
import path from 'path';

parentPort.on('message', async ({ scriptPath, task }) => {
  try {
    // resolve relative path to project root (process.cwd())
    const resolvedPath = path.isAbsolute(scriptPath)
      ? scriptPath
      : path.resolve(process.cwd(), scriptPath);

    // make file:// URL
    const scriptUrl = pathToFileURL(resolvedPath);

    // dynamic import
    const module = await import(scriptUrl.href);

    if (typeof module.default !== 'function') {
      throw new Error(`Script ${scriptPath} must export a default function`);
    }

    const result = await module.default(task);
    parentPort.postMessage(result);

  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
});
