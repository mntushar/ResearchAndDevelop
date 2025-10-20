import os from 'node:os';
import WorkerPool from "./worker_pool";

export const pool = new WorkerPool(os.availableParallelism()); // create pool based on CPU cores
