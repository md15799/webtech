<template>
  <div class="profile">
    <banner/>
    <div class="dashboard">
      <div class="content">
        <h2 class="greeting">Hello, {{ this.name }}</h2>
        <div>
          <router-link :to="{ name: 'user-id-newProject', params: { id: $route.params.id } }">New Project</router-link>
          <div class="projects">
          <h2>Projects</h2>
          <ul id='example-1'>
            <li v-for='project in projects'>
              <router-link :to="{ name: 'user-id-tree', params: { id: $route.params.id, tree: project.id} }">{{ project.name }}</router-link>
            </li>
          </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '~/components/Banner.vue'
import * as axios from 'axios'

export default {
  data() {
    return {
      projects: [],
      name: ''
    }
  },
  components: {
    Banner
  },
  methods: {
    getProjects() {
      axios.post('/api/project/getProjects', { id: this.$route.params.id })
      .then((response) => {
        this.projects = response.data.projects
        this.name = response.data.name
      })
    }
  },
  mounted() {
    this.getProjects()
  }
}
</script>

<style>
.profile {
  height: 100vh;
  justify-content: center;
  background-image: url('/static/forest2.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 100vh;
  align-items: center;
}

.dashboard {
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  margin-top: 5%;
  margin-left:10%;
  margin-bottom: 10%;
  margin-right: 10%;
  height: 70vh;
  align-items: center;
  padding: 7%;
  border-radius: 10px;
}

.greeting {
  color: #4e5259;
}

.projects {
  color: #4e5259;
}

li {
  list-style-type: none;
}
</style>
