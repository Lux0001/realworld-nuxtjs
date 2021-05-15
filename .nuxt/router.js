import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _561aa046 = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _7f043a52 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _61bb5856 = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _8d252954 = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _05801016 = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _6db853c0 = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _bf90a2ba = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _561aa046,
    children: [{
      path: "",
      component: _7f043a52,
      name: "home"
    }, {
      path: "/login",
      component: _61bb5856,
      name: "login"
    }, {
      path: "/register",
      component: _61bb5856,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _8d252954,
      name: "profile"
    }, {
      path: "/settings",
      component: _05801016,
      name: "settings"
    }, {
      path: "/editor",
      component: _6db853c0,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _bf90a2ba,
      name: "article"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
