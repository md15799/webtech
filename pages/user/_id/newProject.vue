<template>
  <div>
    <form @submit.prevent="newProject">
      <input type="text" v-model="projectName" name="name" placeholder="Project Name"/>
      <button type="submit">Open</button>
    </form>
  </div>
</template>

<script>
import * as axios from 'axios'
export default {
  data() {
    return {
      projects: this.$store.state.authUser.projects,
      projectName: ''
    }
  },
  methods: {
   newProject() {
     axios.post('/api/project/new', { id: this.$route.params.id, project: this.projectName })
     .then((response) => {
       this.$router.push({ name: 'user-id-tree', params: { id: this.$route.params.id, tree: response.data.id } })
     })
   }
 }
}
</script>
