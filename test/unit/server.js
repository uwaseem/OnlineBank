/* eslint-env node, mocha */

import Assert from 'assert'
import Request from 'supertest'

import Server from '../../src/server'

describe('#Server', () => {
  let app

  before(() => {
    const noop = () => { }
    console.info = noop
    console.warn = noop
  })

  after(() => {
    delete console.info
    delete console.warn
  })

  beforeEach(async () => {
    const { server } = await Server()
    app = server
  })

  afterEach((done) => {
    app.close()
    done()
  })

  describe('GET /ping', () => {
    it('should return 200 and message === \'pong\'', (done) => {
      Request(app)
        .get('/ping')
        .expect(200)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message, 'pong')
          done()
        })
    })
  })

  describe('Other endpoints', () => {
    it('should return 404', (done) => {
      Request(app)
        .get('/testsAreAwesome')
        .expect(404, done)
    })
  })
})
