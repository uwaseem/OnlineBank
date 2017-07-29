/* eslint-env node, mocha */

import Assert from 'assert'
import Mongoose from 'mongoose'
import Sinon from 'sinon'
import Request from 'supertest'

import dummyUsersList from '../../data/users.json'
import Server from '../../../src/server'

describe('#Users', () => {
  const Users = Mongoose.model('Users')
  let app

  before(() => {
    const noop = () => {}
    console.info = noop
    console.error = noop
  })

  after(() => {
    delete console.info
    delete console.error
  })

  beforeEach(async () => {
    const { server } = await Server()
    app = server
  })

  afterEach((done) => {
    app.close()
    done()
  })

  describe('GET /users', () => {
    before(() => {
      Sinon.stub(Users, 'find')
    })

    it('should return 200 and empty array if there are no users', (done) => {
      Users.find.returns([])

      Request(app)
        .get('/users')
        .expect(200)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message.length, 0)
          done()
        })
    })

    it('should return 200 and list of users if users exist', (done) => {
      Users.find.returns(dummyUsersList)

      Request(app)
        .get('/users')
        .expect(200)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message.length, 2)
          Assert.deepEqual(response.message, dummyUsersList)
          done()
        })
    })

    it('should return 500 and error message if failed to get users from MongoDB', (done) => {
      Users.find.throws(Error('Failed to connect to MongoDB'))

      Request(app)
        .get('/users')
        .expect(500)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }
          Assert.strictEqual(response.message, 'Failed to connect to MongoDB')
          done()
        })
    })
  })
})
