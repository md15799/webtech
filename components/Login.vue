<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header">
                <h3 slot="header">Login</h3>
                <button slot="header" class="modal-default-button" @click="$emit('close')">
                  &#x2715;
                </button>
            </slot>
          </div>
          <div class="modal-body">
            <slot name="body">
              <form v-if="!$store.state.authUser" @submit.prevent="login">
                  <p class="error" v-if="formError">{{ formError }}</p>
                  <input class="login_input" type="text" v-model="formEmail" name="email" placeholder="Email Address"/>
                  <input class="login_input" type="password" v-model="formPassword" name="password" placeholder="Password"/>
                  <button class="login_button" type="submit">Login</button>
              </form>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
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
    login() {
      if(this.formEmail && this.formPassword) {
        this.$store.dispatch('login', {
          email: this.formEmail,
          password: this.formPassword
        }).then((results) => {
          this.$router.push({ name: 'user-id', params: { id: results.id } } )
        }, (error) => {
          this.formError = error.message
        })
        this.formEmail = ''
        this.formPassword = ''
        this.formError = null
      }
      else {
        this.formError = 'Please complete both fields'
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

.error {
  color: red;
  font-size: 80%;
  margin-bottom: 2%;
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
  margin-top: 2%;
  color: #42b983;
  display: inline;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
  color: #9ca1a8;
  border: none;
}

button.modal-default-button:active {
  border-color: #9ca1a8;
}

button.modal-default-button:focus {
  outline-color: #9ca1a8;
  outline-width: thin;
}

.login_input {
  width: 100%;
  padding: 2%;
  outline-color: #42b983;
  outline-width: thin;
  margin-bottom: 2%;
  font-size: 80%;
}

.login_button {
  width: 100%;
  background-color: #42b983;
  color: #fff;
  border-color: #42b983;
  border-radius: 2px;
  margin-top: 2%;
  padding-top: 2%;
  padding-bottom: 2%;
  font-size: 80%;
}

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
}
</style>
