<template>
  <div class="banner">
    <h2 class="banner__title">Lilca</h2>
    <div class="navbar">
      <router-link class="navbar__element" v-if="!$store.state.authUser" to="logout">Sign In</router-link>
      <p v-else class="navbar__element" @click="logout">Sign Out</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formError: null
    }
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
  @import url('https://fonts.googleapis.com/css?family=Francois+One|Passion+One');
  .banner {
    display: inline;

  }

  .banner__title {
    font-family: 'Roboto Mono', monospace;
    font-weight: 100;
    font-size: 3em;
    color: #fff;
    float: left;
    padding-left: 2%;
    padding-top: 1%;
    padding-left: 10%;
  }

  .navbar {
    padding-top: 2%;
    margin-left: 70%;
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
</style>
