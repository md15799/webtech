<template>
  <div class="container">
    <form v-if="!$store.state.authUser" @submit.prevent="login">
      <p class="error" v-if="formError">{{ formError }}</p>
      <input type="text"  v-model="formEmail" name="email" placeholder="Email Address"/>
      <input type="password"  v-model="formPassword" name="password" placeholder="Password"/>
      <button type="submit">Login</button>
    </form>
    <div v-else>
      Hello {{ $store.state.authUser.email }}!
      <pre>I am the secret content, I am shown only when the use is connected.</pre>
      <p><i>You can also refresh this page, you'll still be connected!</i></p>
      <button @click="logout">Logout</button>
    </div>
    <p><nuxt-link to="/tree">Profile</nuxt-link></p>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  data() {
    return {
      formError: null,
      formEmail: '',
      formPassword: ''
    }
  },
  methods: {
    async register() {
      try {
        await this.$store.dispatch('register', {
          email: this.formEmail,
          password: this.formPassword
        })
        this.formPassword = ''
        this.formEmail = ''
        this.formError = null
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>
