const { Route } = require('../lib/decorator')
const path = require('path')

export const router = app => {
  const apiPath = path.resolve(__dirname, '../routes')
  const router = new Route(app, apiPath)

  router.init()
}