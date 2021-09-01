import { expect } from 'chai'
import Pixelfed from '../index.js'

const instance = new Pixelfed('pixelfed.social')

describe('test api', () => {
  it('gets info on current node', async () => {
    const results = await instance.nodeinfo()

    expect(results.metadata.nodeName).to.equal('pixelfed')
  })

  // it("gets current user", async () => {

  //   const results = await instance.user();

  //   expect(results.id).to.equal("");
  // });

  // it("gets user by ID", async () => {

  //   const results = await instance.accountById("");

  //   expect(results.id).to.equal("");
  // });
})
