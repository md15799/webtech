<template>
  <section>
    <div class="home">
        <div class="navbar" v-if="!$store.state.authUser">
          <p id="show-login-modal" class="navbar__element" @click="loginModal = true">Login</p>
          <login v-if="loginModal" @close="loginModal = false"></login>
          <a class="navbar__element" href="#linktoabout">About Us</a>
          <a class="navbar__element" href="#linktocontact">Contact Us</a>
        </div>
        <div class="navbar" v-else>
          <p class="navbar__element" @click="logout">Sign Out</p>
          <router-link class="navbar__element" :to="{ name: 'user-id-newProject', params: {id: $store.state.authUser.id} }">New Project</router-link>
          <router-link class="navbar__element" :to="{ name: 'user-id', params: {id: $store.state.authUser.id} }">Profile</router-link>
          <a class="navbar__element" href="#linktoabout">About Us</a>
          <a class="navbar__element" href="#linktocontact">Contact Us</a>
        </div>
      <div class="home__header">
        <h1 class="home__header__title">
          Lilca
        </h1>
        <h2 class="home__header__subtitle">
          The Little LCA Tool.
        </h2>
        <div class="home__header__links">
          <div v-if="!$store.state.authUser">
            <p id="show-register-modal" class="button--grey" @click="registerModal=true">Sign Up</p>
            <register v-if="registerModal" @close="registerModal=false"></register>
          </div>
        </div>
      </div>
    </div>
    <a name="linktoabout"></a>
    <div class="about">
      <div class="about-header">
        <h2>What is an LCA?</h2>
        <img class="bottle" src="bottle.jpg"/>
      </div>
      <p>Lilca is the little life cycle assessement (LCA) tool. We want it to be easy to make it easy for consumers to make planet friendly decisions. In the modern world, it seems there are endless opportunities to buy stuff which has been manufactured at great cost to the environment.</p>
    </div>
    <a name="linktocontact"></a>
    <div class="contact">
      <h2>Wanna have a chat?</h2>
      <p>Lilca is the little life cycle assessement (LCA) tool. We want it to be easy to </p>
    </div>

  </section>
</template>

<script>
import axios from 'axios'
import Vue from 'vue';
import Login from '~/components/Login.vue'
import Register from '~/components/Register.vue'
export default {
  data() {
    return {
      loginModal: false,
      registerModal: false
    }
  },
  components: {
    Login,
    Register
  },
  methods: {
    async logout() {
      try {
        await this.$store.dispatch('logout')
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Kreon|Roboto+Mono');
@import url('https://fonts.googleapis.com/css?family=Francois+One|Passion+One');

.home {
  height: 100vh;
  justify-content: center;
  background-image: url('../static/plane.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  align-items: center;
}

.home__header {
  position: absolute;
  padding-top: 14%;
  padding-left: 17%;
  text-align: center;
}

.home__header__title {
  font-family: 'Kreon', serif;
  font-weight: 300;
  font-size: 7em;
  color: #fff;
  letter-spacing: 1px;
}

.home__header__subtitle {
  font-family: 'Kreon', serif;
  font-weight: 100;
  font-size: 2.5em;
  color: #fff;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.home__header__links {
  padding-top: 15px;
}

.navbar {
  padding-top: 2%;
  margin-left: 50%;
}
.navbar__element {
  font-family: 'Passion One', sans-serif;
  display: inline;
  padding-left: 2%;
  padding-right: 2%;
  font-size: 1.5em;
  color: #fff;
  text-decoration: none;
}

.about {
  color: #4e5259;
  margin-left: 10%;
  margin-right: 10%;
  margin-top:2%;
  height: 100vh;
}

.about-header {
  height: 10vh;
  justify-content: center;
  min-height: 15vh;
  padding: 15%;
  align-items: center;
}

.bottle {
  float: right
}

.contact {
  color: #769fe0;
  margin-left: 10%;
  margin-right: 10%;
  margin-top:2%;
  height: 100vh;
}
</style>
