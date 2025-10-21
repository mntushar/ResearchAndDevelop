import { multiEx } from "./multiply_extention.js";

export default async function multi (task) {
  return multiEx(task.a, task.b);
}