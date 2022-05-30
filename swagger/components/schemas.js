/**
 * @param {[{schema:Model,name:string,subDocument:string}]} models 
 * Array of mongoose models and exported swagger names e.g. `[ { schema: User, name: "User" } ]`
 */
exports.dynamic = [
  { schema: require('../../models/api/patch').Model, name: "Patch" },
  { schema: require('../../models/user').Model, name: "User" },
  { schema: require('../../models/role').Model, name: "Role" },
]

/**
 * Non auto-generated models
 */
exports.static = {
  
  Links: {
    type: 'array',
    items: {
      properties: {
        href: { type: 'string' },
        rel: { type: 'string' },
        method: { type: 'string' },
      }
    }
  },

  Pagination: {
    properties: {
      results: { type: 'integer', minimum: 0 },
      pageSize: { type: 'integer', minimum: 1 },
      pages: {
        type: 'object',
        properties: {
          current: { type: 'integer', minimum: 1 },
          previous: { type: 'integer' },
          next: { type: 'integer' },
          last: { type: 'integer', minimum: 1 }
        }
      }
    }
  },

  Error: {
    type: 'object',
    properties: {
      code: { type: 'string' },
      target: { type: 'string' },
      message: { type: 'string' },
      details: { type: 'string' }
    }
  },

  Filter: {
    properties: {
      and: {
        type: 'array',
        items: {
          properties: {
            field: { type: 'string', example: 'status.code' },
            values: { type: 'array', items: { type: 'string' }, example: '0100' },
            operator: { type: 'string', default: '$in', enum: ['$in', '$nin'] },
            explicit: { type: 'boolean', default: false }
          },
          required: [ 'field', 'values' ]
        }
      },
      or: {
        type: 'array',
        items: {
          properties: {
            field: { type: 'string', example: 'status.code' },
            values: { type: 'array', items: { type: 'string' }, example: '0100' },
            operator: { type: 'string', default: '$in', enum: ['$in', '$nin'] },
            explicit: { type: 'boolean', default: false }
          },
          required: [ 'field', 'values' ]
        }
      }
    }
  },

  Range: {
    properties: {
      field: { type: 'string' },
      low: { type: 'string' },
      high: { type: 'string' },
      type: {
        type: 'string',
        default: 'string',
        enum: ['string', 'number', 'date', 'datetime']
      },
    },
    required: ['field', 'low', 'high']
  }

}