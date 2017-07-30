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

    Sinon.stub(Users, 'find')
    Sinon.stub(Users, 'findOne')
    Sinon.stub(Users, 'findOneAndUpdate')
    Sinon.stub(Users, 'create')
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

  describe('GET /user/username/:username', () => {
    it('should return 200 and user\'s information if user exist', (done) => {
      Users.findOne.returns(dummyUsersList[1])

      Request(app)
        .get('/user/username/spiderman')
        .expect(200)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.deepEqual(response.message, dummyUsersList[1])
          done()
        })
    })

    it('should return 400 and appropriate message if user does not exist', (done) => {
      Users.findOne.returns(null)

      Request(app)
        .get('/user/username/batman')
        .expect(400)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message, 'User batman does not exist')
          done()
        })
    })

    it('should return 500 and error message if failed to get user from MongoDB', (done) => {
      Users.findOne.throws(Error('Failed to connect to MongoDB'))

      Request(app)
        .get('/user/username/deadpool')
        .expect(500)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }
          Assert.strictEqual(response.message, 'General failure when getting information for user deadpool')
          done()
        })
    })
  })

  describe('POST /user', () => {
    it('should return 200 and user\'s information if create user success', (done) => {
      Users.findOne.returns(null)
      Users.create.returns(dummyUsersList[0])

      Request(app)
        .post('/user')
        .send({ username: 'spiderman', firstName: 'Peter', lastName: 'Parker' })
        .expect(200)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.deepEqual(response.message, dummyUsersList[0])
          done()
        })
    })

    it('should return 400 and appropriate message if user already exist', (done) => {
      Users.findOne.returns(dummyUsersList[0])

      Request(app)
        .post('/user')
        .send({ username: 'spiderman', firstName: 'Peter', lastName: 'Parker' })
        .expect(400)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message, 'Username spiderman already exist')
          done()
        })
    })

    it('should return 500 and error message if failed to create user', (done) => {
      Users.findOne.returns(null)
      Users.create.throws(Error('Failed to connect to MongoDB'))

      Request(app)
        .post('/user')
        .send({ username: 'spiderman', firstName: 'Peter', lastName: 'Parker' })
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }
          Assert.strictEqual(response.message, 'General failure when creating user spiderman')
          done()
        })
    })
  })

  describe('PUT /user/username/:username', () => {
    it('should return 200 and user\'s information if update user success', (done) => {
      Users.findOneAndUpdate.returns(dummyUsersList[0])

      Request(app)
        .put('/user/username/spiderman')
        .send({ username: 'spiderman', firstName: 'Peter', lastName: 'Parker' })
        .expect(200)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.deepEqual(response.message, dummyUsersList[0])
          done()
        })
    })

    it('should return 400 and appropriate message if user does not exist', (done) => {
      Users.findOneAndUpdate.returns(null)

      Request(app)
        .put('/user/username/batman')
        .send({ username: 'batman', firstName: 'Bruce', lastName: 'Wayne' })
        .expect(400)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message, 'Failed to update user batman')
          done()
        })
    })

    it('should return 400 and appropriate message if trying to update username', (done) => {
      Request(app)
        .put('/user/username/spiderman')
        .send({ username: 'ironman', firstName: 'Peter', lastName: 'Parker' })
        .expect(400)
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message, 'Cannot update username')
          done()
        })
    })

    it('should return 500 and error message if failed to create user', (done) => {
      Users.findOneAndUpdate.throws(Error('Failed to connect to MongoDB'))

      Request(app)
        .put('/user/username/spiderman')
        .send({ username: 'spiderman', firstName: 'Peter', lastName: 'Parker' })
        .end((error, { body: response }) => {
          if (error) {
            return done(error)
          }

          Assert.strictEqual(response.message, 'General failure when updating user spiderman')
          done()
        })
    })
  })
})
