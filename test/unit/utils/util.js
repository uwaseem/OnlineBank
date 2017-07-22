/* eslint-env node, mocha */

import Assert from 'assert'

import {
  createReturnObject
} from '../../../utils/util'

describe('#createReturnObject', () => {
  describe('when success === \'true\' or \'false\'', () => {
    it('should return code, success and message', () => {
      const returnObject = createReturnObject(200, true, 'This is a test')
      const expectedObject = {
        code: 200,
        success: true,
        message: 'This is a test'
      }

      Assert.deepEqual(returnObject, expectedObject)
    })
  })

  describe('when success !== \'true\' or \'false\'', () => {
    it('should return code, success and message', () => {
      const returnObject = createReturnObject(200, 'hello', 'This is a test')
      const expectedObject = {
        code: 500,
        success: false,
        message: 'hello is not a valid value for success'
      }

      Assert.deepEqual(returnObject, expectedObject)
    })
  })
})
