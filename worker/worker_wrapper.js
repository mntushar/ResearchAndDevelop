import { parentPort } from 'node:worker_threads';
import { pathToFileURL } from 'node:url';
import path from 'path';
import vm from 'node:vm';

parentPort.on('message', async ({ scriptPath, scriptCode, task }) => {
  try {
    let result;

    if (scriptPath) {
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
      
      result = await module.default(task);
    }
    else if (scriptCode) {
      /// Execute script code in a vm context
      const context = { task, result: null, console };
      vm.createContext(context); // Create sandboxed context

      const wrappedCode = `
        (async () => {
          const fn = (task) => {
            ${scriptCode}
          };
          result = await fn(task);
        })();
      `;

      // Run code in vm
      await vm.runInContext(wrappedCode, context);

      result = context.result; // get result from vm context
    }
    else {
      throw new Error('Neither scriptPath nor scriptCode provided');
    }

    parentPort.postMessage(result);

  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
});
