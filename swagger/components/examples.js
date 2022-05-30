/**
 * example values
 */
module.exports = {
  PATCHDataModel: {
    value: {
      patch: [
        {
          op: 'add | copy | replace | move | remove | test',
          path: 'string',
          from: 'string',
          value: 'string'
        }
      ]
    }
  },
  PATCHReplaceAdd: {
    value: {
      patch: [
        {
          op: 'replace',
          path: '/occupancy/comment',
          value: 'some comment'
        },
        {
          op: 'add',
          path: '/occupancy/code',
          value: '0002'
        }
      ]
    }
  },
  PATCHCopy: {
    value: {
      patch: [
        {
          op: 'copy',
          from: '/occupancy/description/en',
          path: '/occupancy/description/fr'
        }
      ]
    }
  }
}