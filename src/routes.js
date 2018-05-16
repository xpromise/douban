import AC from './components/async_load'

export default [
  {
    name: '首页',
    icon: 'home',
    path: '/',
    component: AC(() => require('./views/home'))
  },
  {
    name: '详情页',
    path: '/detail/:id',
    component: AC(() => require('./views/movie/detail'))
  }
]