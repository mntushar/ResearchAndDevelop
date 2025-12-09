const fs = require('fs');
const os = require('os');

const [, input] = fs.readFileSync(0, 'utf8').trim().split(os.EOL);

const result = input.split('').reduce((count, currentValue, index, array) => {
    if(index > 0 && currentValue === array[index - 1])
        count += 1;
    return count;
}, 0);

console.log(result);