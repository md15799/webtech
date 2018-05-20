import Vue from 'vue';
import Vuex from 'vuex';
require('whatwg-fetch');

const store = () => new Vuex.Store({
  state: {
    authUser: null
  },
  mutations: {
    SET_USER: function (state, user) {
      state.authUser = user
    }
  },
  actions: {
    // nuxtServerInit is called by Nuxt.js before server-rendering every page
    nuxtServerInit({ commit }, { req }) {
      if (req.session && req.session.authUser) {
        commit('SET_USER', req.session.authUser)
      }
    },
    async login ({ commit }, { email, password }) {
      return fetch('/api/auth/login', {
        // Send the client cookies to the server
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })
      .then((res) => {
        if (res.status === 401) {
          throw new Error('Details are incorrect')
        } else {
          return res.json()
        }
      })
      .then((authUser) => {
        commit('SET_USER', authUser)
        return authUser
      })
    },
    async register ({ commit }, { email, password, first, last }) {
      return fetch('/api/auth/register', {
        // Send the client cookies to the server
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          first,
          last
        })
      })
      .then((res) => {
        if (res.status === 401) {
          throw new Error('Account with that email address already exists.')
        } else {
          return res.json()
        }
      })
      .then((authUser) => {
        commit('SET_USER', authUser)
        return authUser
      })
    },
    async logout ({ commit }) {
      return fetch('/api/auth/logout', {
        // Send the client cookies to the server
        credentials: 'same-origin',
        method: 'POST'
      })
      .then(() => {
        commit('SET_USER', null)
      })
    }
  }
})

export default store;
