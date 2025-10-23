import { multiEx } from "./multiply_extention.mjs";

export default async function multi (task) {
  return multiEx(task.a, task.b);
}