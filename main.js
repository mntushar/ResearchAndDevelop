const fs = require("fs");
const os = require('os');

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
let idx = 0;

const MOD = 676767677;
const t = input[idx++];
let ans = [];

for (let tc = 0; tc < t; tc++) {
  const n = input[idx++];
  let a = [];
  let sumGreater = 0;
  let hasGreater = false;

  for (let i = 0; i < n; i++) {
    a.push(input[idx++]);
    if (a[i] > 1) {
      sumGreater += a[i];
      hasGreater = true;
    }
  }

  let res;
  if (!hasGreater) {
    res = 1;
  } else {
    res = sumGreater;
    if (a[n - 1] === 1) res += 1;
  }

  ans.push(String(res % MOD));
}

console.log(ans.join("\n"));
