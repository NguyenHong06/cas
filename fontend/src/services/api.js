export default {
  queryRouteList: '/routes',

  queryUserInfo: '/user',
  logout: '/user/logout',
  login: 'POST /oauth',

  queryCampaign: '/campaign/:id',
  queryCampaignList: '/campaign',
  updateCampaign: 'PUT /campaign/:id',
  createCampaign: 'POST /campaign',
  removeCampaign: 'DELETE /campaign/:id',
  removeCampaignList: 'POST /campaign/delete',

  queryPostList: '/posts',
  queryDashboard: '/dashboard',

  
  queryProducts: 'GET /product',
  removeProduct: 'DELETE /product/:id',
  queryProduct: 'GET /product/:id',
  updateProduct: 'PUT /product/:id',
  createProduct: 'POST /product',
}
