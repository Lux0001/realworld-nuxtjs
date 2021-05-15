import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _62b8a68f = () => interopDefault(import('..\\pages\\layout' /* webpackChunkName: "" */))
const _ba4794f8 = () => interopDefault(import('..\\pages\\home' /* webpackChunkName: "" */))
const _8e3a7938 = () => interopDefault(import('..\\pages\\login' /* webpackChunkName: "" */))
const _37336a38 = () => interopDefault(import('..\\pages\\profile' /* webpackChunkName: "" */))
const _39a32248 = () => interopDefault(import('..\\pages\\settings' /* webpackChunkName: "" */))
const _56e9ccd2 = () => interopDefault(import('..\\pages\\editor' /* webpackChunkName: "" */))
const _699ee39e = () => interopDefault(import('..\\pages\\article' /* webpackChunkName: "" */))

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
    component: _62b8a68f,
    children: [{
      path: "",
      component: _ba4794f8,
      name: "home"
    }, {
      path: "/login",
      component: _8e3a7938,
      name: "login"
    }, {
      path: "/register",
      component: _8e3a7938,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _37336a38,
      name: "profile"
    }, {
      path: "/settings",
      component: _39a32248,
      name: "settings"
    }, {
      path: "/editor",
      component: _56e9ccd2,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _699ee39e,
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
