const Mock = require('mockjs')

export default {
  'POST /mock/member/login': (req, res) => {
    return res.json(
      Mock.mock({
        error: '',
        status: 1,
        data: {
          name: req.body.name,
          token: '@string',
          failure_time: Date.parse(new Date()) / 1000 + 24 * 60 * 60
        }
      })
    )
  },
  'GET /mock/member/permission': (req, res) => {
    let permissions = []
    if (req.query.name == 'admin') {
      permissions = [
        'permission.browse',
        'permission.create',
        'permission.edit',
        'permission.remove'
      ]
    } else if (req.query.name == 'test') {
      permissions = ['permission.browse']
    }
    return res.json({
      error: '',
      status: 1,
      data: {
        permissions
      }
    })
  }
}
