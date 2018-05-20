<template>
  <div class="navbar">
    <!-- <router-link v-if="!$store.state.authUser" class="navbar__element" to="login">Sign In</router-link> -->
    <div v-if="!$store.state.authUser" id="app">
      <button id="show-modal" @click="showModal = true">Show Modal</button>
      <login v-if="showModal" @close="showModal = false"></login>
    </div>
    <p v-else class="navbar__element" @click="logout">Sign Out</p>
    <p class="navbar__element">Tutorial</p>
    <p class="navbar__element">About Us</p>
    <p class="navbar__element">Contact Us</p>
  </div>
</template>

<script>
import Vue from 'vue';
import Login from '~/components/Login.vue'
export default {
  data() {
    return {
      showModal: false
    }
  },
  components: {
    Login
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

/* <style>
  /* @import url('https://fonts.googleapis.com/css?family=Francois+One|Passion+One');

  .navbar {
    margin-left: 50%;
  }

  .navbar__element {
    font-family: 'Passion One', sans-serif;
    display: inline;
    padding-left: 2%;
    padding-right: 2%;
    font-size: 1.5em;
    text-decoration: none;
  }
  .modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
} */
</style> */
