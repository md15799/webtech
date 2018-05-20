<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              <h3 slot="header">Register</h3>
              <button slot="header" class="modal-default-button" @click="$emit('close')">&#x2715;</button>
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              <form v-if="!$store.state.authUser" @submit.prevent="register">
                  <p class="error" v-if="formError">{{ formError }}</p>
                  <input type="text" v-model="formFirstName" name="firstName" placeholder="First Name"/>
                  <input type="text" v-model="formLastName" name="lastName" placeholder="Last Name"/>
                  <input type="text" v-model="formEmail" name="email" placeholder="Email Address"/>
                  <input type="password" v-model="formPassword" name="password" placeholder="Password"/>
                  <button type="submit">Register</button>
              </form>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              default footer
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
      formPassword: '',
      formFirstName: '',
      formLastName: ''
    }
  },
  methods: {
    register() {
      if(this.formEmail && this.formPassword && this.formFirstName && this.formLastName) {
        this.$store.dispatch('register', {
          email: this.formEmail,
          password: this.formPassword,
          first: this.formFirstName,
          last: this.formLastName
        }).then((results) => {
          console.log(results)
          this.$router.push({ name: 'user-id', params: { id: results.id } } )
        }, (error) => {
          this.formError = error.message
        })
        this.formEmail = ''
        this.formPassword = ''
        this.formFirstName = ''
        this.formLastName = ''
        this.formError = null
      }
      else {
        this.formError = 'Please complete all fields'
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
}
</style>
