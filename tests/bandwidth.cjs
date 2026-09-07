const assert = require('node:assert/strict');
const { estimatePayload } = require('../bandwidth.js');

const example = estimatePayload(12, 60);
assert.ok(Math.abs(example.payloadGb - 5.4) < 1e-10);
assert.ok(Math.abs(example.relayCombinedGb - 10.8) < 1e-10);
assert.equal(estimatePayload(50, 240).payloadGb, 90);
assert.equal(estimatePayload(1, 5).payloadGb, 0.0375);
assert.ok(Math.abs(estimatePayload(8, 60).payloadGb - 3.6) < 1e-10);
for (const args of [[NaN,60],[Infinity,60],[0,60],[51,60],[12,0],[12,241]]) {
  assert.throws(() => estimatePayload(...args), RangeError);
}
console.log('Payload units, endpoint/relay distinction, bounds and invalid inputs passed');
