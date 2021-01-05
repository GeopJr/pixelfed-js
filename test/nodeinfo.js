'use strict'
const Pixelfed = require('../index.js').default

const instance = new Pixelfed('pixelfed.social')

async function test () {
  const results = await instance.nodeinfo()
  console.log(results)
}

test()
