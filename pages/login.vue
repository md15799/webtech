<template>
  <div class="container">
    <form v-if="!$store.state.authUser" @submit.prevent="login">
      <p class="error" v-if="formError">{{ formError }}</p>
      <input type="text" v-model="formEmail" name="email" placeholder="Email Address"/>
      <input type="password" v-model="formPassword" name="password" placeholder="Password"/>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formError: null,
      formEmail: '',
      formPassword: ''
    }
  },
  methods: {
    async login() {
      try {
        this.$store.dispatch('login', {
          email: this.formEmail,
          password: this.formPassword
        }).then((results) => {
          this.$router.push({ name: 'user-id', params: { id: results.id } } )
        })
        this.formEmail = ''
        this.formPassword = ''
        this.formError = null
      } catch (e) {
        this.formError = e.message
      }
    },
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
.container {
  padding: 100px;
}
</style>
