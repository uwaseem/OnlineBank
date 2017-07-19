/* eslint-env node, mocha */

import Assert from 'assert'
import Request from 'supertest'

import Server from '../../../src/server'

describe('#Account', () => {
  let app

  beforeEach(async () => {
    const { server } = await Server()
    app = server
  })

  afterEach((done) => {
    app.close()
    done()
  })

  describe('GET /accounts', () => {
    it('should return 200 and message === \'wow\'', (done) => {
      Request(app)
        .get('/accounts')
        .expect(200)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message, 'wow')
          done()
        })
    })
  })

  describe('POST /account', () => {
    it('should return 200 and message === \'success\'', (done) => {
      Request(app)
        .post('/account')
        .expect(200)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message, 'success')
          done()
        })
    })
  })
})
