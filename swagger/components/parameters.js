/**
 * common parameters
 */
module.exports = {
  filter: {
    name: 'filter',
    'in': 'query',
    description: 'filter fields using a custom filter in JSON format (see Filter schema below)',
    required: false,
    schema: {
      type: 'string'
    }
  },
  range: {
    name: 'range',
    'in': 'query',
    description: 'filter between a range of 2 values using a custom filter in JSON format (see Range schema below)',
    required: false,
    schema: {
      type: 'string'
    }
  },
  fields: {
    name: 'fields',
    'in': 'query',
    description: 'fields to select',
    required: false,
    schema: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  limit: {
    name: 'limit',
    'in': 'query',
    description: 'retrieval limit / pagination size (enter 0 for no limit)',
    required: false,
    schema: {
      type: 'integer',
      minimum: 0,
      'default': 10
    }
  },
  page: {
    name: 'page',
    'in': 'query',
    description: 'page number',
    required: false,
    schema: {
      type: 'integer',
      minimum: 1,
      'default': 1
    }
  },
  order: {
    name: 'order',
    'in': 'query',
    description: 'sort order e.g. _id (asc) or -_id',
    required: false,
    schema: {
      type: 'string'
    }
  },
  
}