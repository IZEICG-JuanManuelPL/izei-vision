const { analyzeImage } = require('./src/services/openaiService');
const fs = require('fs');

async function test() {
  const dummy = '/tmp/dummy.png';
  fs.writeFileSync(dummy, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64'));
  try {
    const res = await analyzeImage(dummy);
    console.log(res);
  } catch (e) {
    console.error("FAILED", e);
  }
}
test();
