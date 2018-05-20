<template>
  <div>
    <banner/>
    <div>
      <div class="toolbar">
        <button type="button">Add Process</button>
      </div>
      <div class="workspace">
        <nuxt/>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '~/components/Banner.vue'

export default {
  components: {
    Banner
  }
}
</script>

<style>
.workspace {
    border-style: solid;
    border-color: #000;
    height: 80vh;
    width: 65%;
    float:right;
    margin: 1%;
  }

.toolbar{
    border-style: solid;
    border-color: #000;
    height: 80vh;
    width: 15%;
    float: left;
    margin: 1%;
  }

.console {
  display: inline;
}

.process {
  border-style: solid;
  border-color: #000;
  width: 1%;
  height: 1%;

}

</style>
