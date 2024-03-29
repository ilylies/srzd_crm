module.exports = [
  {
    url: 'member/login',
    type: 'post',
    result: option => {
      return {
        error: '',
        status: 1,
        data: {
          name: option.body.name,
          token: '@string',
          failure_time: Date.parse(new Date()) / 1000 + 24 * 60 * 60
        }
      }
    }
  },
  {
    url: 'member/permission',
    type: 'get',
    result: option => {
      let permissions = []
      if (option.query.name == 'admin') {
        permissions = [
          'permission.browse',
          'permission.create',
          'permission.edit',
          'permission.remove'
        ]
      } else if (option.query.name == 'test') {
        permissions = ['permission.browse']
      }
      return {
        error: '',
        status: 1,
        data: {
          permissions
        }
      }
    }
  }
]
