

var requests = require('../swagger-writer').requests;
var responses = require('../swagger-writer').responses;

const SCHEMA =  require('../swagger-writer').PARAM_SCHEMAS;
const SEARCH_PARAMS = [
  requests.refParameter('fields'),
  requests.refParameter('limit'),
  requests.refParameter('page'),
  requests.refParameter('order'),
  requests.refParameter('filter'),
  requests.refParameter('range')
]

/**
 * API paths
 */
module.exports = {

  '/users': {
    get: {
      summary: 'Get all users',
      description: 'Get all users or a limited set using various query options.',
      operationId: 'GetUsers',
      tags: ['users'],
      externalDocs: {},
      parameters: [
        ...SEARCH_PARAMS,
        requests.queryParameter('active', 'retrieve only active or inactive users', SCHEMA.BOOLEAN)
      ],
      responses: responses.getManyResponses('users', 'User')
    },
    post: {
      summary: 'Create a user',
      description: 'Create a new user.',
      operationId: 'createUser',
      tags: ['users'],
      requestBody: requests.postBody('user', 'User'),
      responses: responses.postResponses('user', 'User')
    }
  },
  '/users/{username}': {
    get: {
      tags: ['users'],
      summary: 'Get user by username',
      description: 'Retrieve a user by their username.',
      operationId: 'getUserByName',
      parameters: [
        requests.pathParameter('active', 'the username of the user to be fetched', SCHEMA.STRING)
      ],
      responses: responses.getOneResponses('user', 'User')
    },
    put: {
      tags: ['users'],
      summary: 'Update user',
      description: 'Modify an existing user.',
      operationId: 'updateUser',
      parameters: [
        requests.pathParameter('active', 'the username of the user to be updated', SCHEMA.STRING)
      ],
      requestBody: requests.putBody('user', 'User'),
      responses: responses.putResponses('user', 'User')
    },
    delete: {
      tags: ['users'],
      summary: 'Delete user',
      description: 'Delete an existing user.',
      operationId: 'deleteUser',
      parameters: [
        requests.pathParameter('active', 'the username of the user to be deleted', SCHEMA.STRING)
      ],
      responses: responses.deleteResponses('user')
    }
  },

  '/roles': {
    get: {
      summary: 'Get all roles',
      description: 'Get all roles or a limited set using various query options.',
      operationId: 'GetRoles',
      tags: ['roles'],
      externalDocs: {},
      parameters: [
        ...SEARCH_PARAMS
      ],
      responses: responses.getManyResponses('roles', 'Role')
    }
  },
  '/roles/{roleId}': {
    get: {
      tags: ['roles'],
      summary: 'Get role by roleId',
      description: 'Retrieve a role by based on its roleId.',
      operationId: 'getRoleByRoleId',
      parameters: [
        requests.pathParameter('roleId', 'The roleId that is being fetched', SCHEMA.STRING)
      ],
      responses: responses.getOneResponses('role', 'Role')
    }
  }

}