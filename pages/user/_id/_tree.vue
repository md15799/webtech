<template>
  <div>
    <h2 class="workspace_title">Lilca</h2>
    <div>
      <div class="toolbar">
        <div v-if="edit" id='toolbar_contents'>
          <p>Product Name</p>
          <p class="error" v-if="productNameError">{{ productNameError }}</p>
          <input class="product_name" type="text" v-model="productName" v-on:input="debounceName" name="productName" placeholder="Product Name"/>
          <p>Functional Unit</p>
          <input class="functional_unit" type="text" v-model="functional_unit" v-on:input="debounceFU" name="functional_unit" placeholder="Functional Unit"/>
          <input type="text" v-model="units" v-on:input="debounceUnits" name="units" placeholder="Units"/>
          <p>Production Location</p>
          <input type="text" v-model="location" v-on:input="debounceLocation" name="location" placeholder="Production Location"/>
          <p>Waste</p>
          <input type="text" v-model="waste" v-on:input="waste" name="waste" placeholder="Waste"/>
          <p>Transport Mode</p>
          <form @submit.prevent="saveTransport">
            <select v-model='selectedTransport' class="select-style">
              <option v-for="product in transportModes" v-bind:value='product.id'>{{product.mode}}</option>
            </select>
            <input type="text" v-model="selectedMiles" name="selectedMiles" placeholder="Miles"/>
            <input type="text" v-model="unitPerLoad" name="unitPerLoad" placeholder="Units Per Load"/>
            <button class="add_button" type="submit">Add</button>
          </form>
          <p>Process Energy</p>
          <form @submit.prevent="saveEnergy">
            <select v-model='selectedSource' class="select-style">
              <option v-for="product in energySources" v-bind:value='product.id'>{{product.source}}</option>
            </select>
            <input type="text" v-model="selectedEnergy" name="quantity" placeholder="Energy in kWh"/>
            <button class="add_button" type="submit">Add</button>
          </form>
          <p>Choose Input Product</p>
          <form @submit.prevent="saveInput">
            <select v-model='selectedInput' class="select-style">
              <option v-for="product in allProducts" v-bind:value='product.id'>{{product.name}}</option>
            </select>
            <input type="text" v-model="quantity" name="quantity" placeholder="Quantity"/>
            <button class="add_button" type="submit">Add</button>
          </form>
          <p>Choose Output Product</p>
          <form @submit.prevent="saveOutput">
            <select class="select-style" v-model='selectedOutput'>
              <option v-for="product in allProducts" v-bind:value='product.id'>{{product.name}}</option>
            </select>
            <input type="text" v-model="quantity" name="quantity" placeholder="Quantity"/>
            <button class="add_button" type="submit">Add</button>
          </form>
          <p>Don't see the item you're looking for? Create a new one.</p>
          <button>Add Input/Output</button>
          <button @click="deleteNode()">Delete</button>
        </div>
        <div v-else>
          <h3>Products</h3>
          <p>Create an Input</p>
          <form @submit.prevent="createInput">
            <p class="error" v-if="createInputError">{{ createInputError }}</p>
            <input type="text" v-model="newInput" name="newInput" placeholder="New Input"/>
            <button type="submit">Add Input</button>
          </form>
          Create an Output
          <form @submit.prevent="createOutput">
            <p class="error" v-if="createOutputError">{{ createOutputError }}</p>
            <input type="text" v-model="newOutput" name="newInput" placeholder="New Output"/>
            <button type="submit">Add Output</button>
          </form>
      </div>
      </div>
      <div class="workspace">
        <div id="categoryHierarchy" class="foo"></div>
      </div>
    </div>
  </div>
</template>


<script>
import * as d3 from 'd3';
import * as dagreD3 from 'dagre-d3';
import * as axios from 'axios'
const _ = require('lodash');
import Banner from '~/components/Banner.vue'

export default {
  data(){
    return {
      states: {},
      edges: [],
      productName: '',
      location: '',
      productId: 0,
      functional_unit: 1,
      units: '',
      waste: true,
      elemId: '',
      g: new dagreD3.graphlib.Graph().setGraph({}),
      allProducts: [],
      selectedInput: '',
      selectedOutput:'',
      newInput: '',
      newOutput: '',
      createInputError: '',
      createOutputError: '',
      transportModes: [],
      energySources: [],
      edit: true,
      quantity: '',
      selectedTransport: '',
      selectedMiles: 0,
      unitPerLoad: 1,
      selectedSource: '',
      selectedEnergy: 0,
      productNameError: ''
    }
  },
  components: {
    Banner
  },
  methods: {
    buildGraph(states, edges) {
      // Create a new directed graph
      const g = this.g
      let ids = []
      let firstIter = true;

      g.graph().rankDir = 'LR';
      // Add states to the graph, set labels, and style
      Object.keys(states).forEach((state) => {
        var value = states[state]
        ids.push(value.id)
        value.id = 'elem'.concat(value.id)
        var state_label = [state, ' ', '(', value.functional_unit, value.units, ')'].join('')
        if(state === 'a') value.label = '    ';
        else value.label = state_label;
        value.rx = value.ry = 5;
        g.setNode(state, value)
        if (firstIter) {
          this.productName = state
          const product = states[state]
          this.location = product.production_location
          this.productId = product.id.replace('elem', '')
          this.waste = product.waste
          this.functional_unit = product.functional_unit
          this.units = product.units
        }
        firstIter = false
      });

      this.getAllProducts(ids).then(() => {
        let emissions = 0;
        Object.keys(states).forEach((state) => {
          var value = states[state]
          this.energySources.forEach((source) => {
            if(source == value.energySource){
              emissions = source.co2_emissions
            }
          })
          var label = state.concat('_energy')
          var energy = {label: 'Electricity: \n'.concat(String(Number.parseFloat(value.energy * value.quantity).toPrecision(3)).concat(' kWh')), rx:5, ry:5, id: 'energy'.concat(value.id), total: (value.energy * value.quantity)}
          g.setNode(label, energy)
          g.node(label).style = "fill: #fff; stroke:#fff";
          g.setEdge(label, state, { label: '' })
        });

        edges.forEach((edge) => {
          var carbon_label = ''
          var value = states[edge[0]]
          if(value.transportMode && value.miles) {
            let mpg, fuelId = 0
            this.transportModes.forEach((t) => {
              if(t.id == value.transportMode) {
                console.log(t)
                mpg = t.milesPerGallon
                fuelId = t.energySourceId
              }
            })
            this.energySources.forEach((energy) => {
              if(fuelId == energy.id) {
                emissions = energy.co2_emissions
              }
            })
            const carbon = Number.parseFloat(emissions * mpg * value.miles * value.quantity / value.unitsPerLoad).toPrecision(3)
            carbon_label = 'CO2: '.concat(carbon.toString().concat(' kg'))
            g.setEdge(edge[0], edge[1], { label: carbon_label})
          }
          else {
            g.setEdge(edge[0], edge[1], { label: ''})
          }
        })



        // Create the renderer
        var render = new dagreD3.render();

        if(process.browser) {
          // Set up an SVG group so that we can translate the final graph.
          var root = d3.select("#categoryHierarchy")
          this.root = root
          var svg = root.append("svg")
              .attr("width", root.clientWidth)
              .attr("height", root.clientHeight)
          var inner = svg.append("g")
          // Set up zoom support
          var zoom = d3.zoom()
              .on("zoom",  function() {
                inner.attr("transform", d3.event.transform);
              });
          svg.call(zoom);

          // Simple function to style the tooltip for the given node.
          // var styleTooltip = function(name, description) {
          //   return "<p class='name'>" + name + "</p><p class='description'>" + description + "</p>";
          // };

          // Run the renderer. This is what draws the final graph.
          render(inner, g);

          inner.selectAll('g.node')
            .on('click', this.click)

          // inner.selectAll("g.node")
          //   .attr("title", function(v) { return styleTooltip(v, g.node(v).description) })
          //   .each(function(v) { $(this).tipsy({ gravity: "w", §opacity: 1, html: true }); });

          // Center the graph
          var initialScale = 1.2;
          svg.call(zoom.transform, d3.zoomIdentity.translate(50, (svg.attr("height") - g.graph().height * initialScale) / 100).scale(initialScale));
          svg.attr('height', g.graph().height * initialScale + 40);
        }
      })
    },
    click(name) {
      if(this.states[name]) {
        this.productName = name
        const product = this.states[name]
        console.log(product)
        this.location = product.production_location
        this.productId = product.id.replace('elem', '')
        this.waste = product.waste
        this.functional_unit = product.functional_unit
        this.units = product.units
      }
    },
    getProject(productId) {
      return axios.post('/api/project/get', { id: productId })
              .then((response) => {
                this.states = response.data.states
                this.edges = response.data.edges
              })
    },
    getAllProducts(included) {
      return axios.post('/api/project/getAllProducts', { exclude: included })
        .then((response) => {
          this.allProducts = response.data.products
          this.transportModes = response.data.transportModes
          this.energySources = response.data.energySources
        })
    },
    saveInput() {
      axios.post('/api/project/addInput', { productId: this.productId, inputId: this.selectedInput })
      .then((response) => {
        this.selectedInput = ''
        this.getProject(this.$route.params.tree).then(() => {
          this.root.selectAll("*").remove();
          this.buildGraph(this.states, this.edges)
        })
      })
    },
    saveOutput() {
      axios.post('/api/project/addOutput', { productId: this.productId, outputId: this.selectedOutput })
      .then((response) => {
        this.selectedInput = ''
        this.getProject(this.$route.params.tree).then(() => {
          this.root.selectAll("*").remove();
          this.buildGraph(this.states, this.edges)
        })
      })
    },
    deleteNode() {
      axios.post('/api/project/deleteNode', { productId: this.productId, projectId: this.$route.params.tree })
      .then((response) => {
        this.states = response.data.states
        this.edges = response.data.edges
        this.root.selectAll("*").remove();
        this.g = new dagreD3.graphlib.Graph().setGraph({})
        this.buildGraph(this.states, this.edges)
        this.productName = ''
        this.location = ''
        this.productId = ''
        this.waste = ''
        this.functional_unit = ''
        this.units = ''
      })
    },
    validateNewProduct(input) {
      this.allProducts.forEach((product) => {
        console.log(product.name)
        if(product.name == input) {
          return false
        }
      })
      Object.keys(this.states).forEach((state) => {
        if(state == input) {
          return false
        }
      })
      return true
    },
    createInput() {
      if(this.validateNewProduct(this.newInput)) {
        if(this.newInput) {
          axios.post('/api/project/createInput', { name: this.newInput, project: this.productId })
          .then((response) => {
            this.newInput = ''
            this.getProject(this.$route.params.tree).then(() => {
              this.root.selectAll("*").remove();
              this.buildGraph(this.states, this.edges)
            })
          })
        }
        else {
          this.createInputError = 'Please enter product name'
        }
      }
      else {
        this.createInputError = this.newInput.concat(' already exists')
      }
    },
    createOutput() {
      if(this.validateNewProduct(this.newOutput)) {
        if(this.newOutput) {
          axios.post('/api/project/createOutput', { name: this.newOutput, project: this.productId })
          .then((response) => {
            this.newOutput = ''
            console.log(response)
            this.getProject(this.$route.params.tree).then(() => {
              this.root.selectAll("*").remove();
              this.buildGraph(this.states, this.edges)
            })
          })
        }
        else {
          this.createOutputError = 'Please enter product name'
        }
      }
      else {
        this.createOutputError = this.newOutput.concat(' already exists')
      }
    },
    debounceName: _.debounce(function(e){
        this.productName = e.target.value
        console.log(this)
        axios.post('/api/project/updateName', { productId: this.productId, name: this.productName })
        .then((response) => {
          console.log(response)
          if(response.status == 200){
            this.getProject(this.$route.params.tree).then(() => {
              this.root.selectAll("*").remove();
              this.buildGraph(this.states, this.edges)
            })
          }
          else {
            this.productNameError = 'Product with this name already exists'
          }
        })
      }, 500),
    debounceFU: _.debounce(function(e){
        this.productName = e.target.value;
        axios.post('/api/project/updateFU', { productId: this.productId, fu: this.functional_unit })
        .then((response) => {
          this.getProject(this.$route.params.tree).then(() => {
            this.root.selectAll("*").remove();
            this.buildGraph(this.states, this.edges)
          })
        })
      }, 500),
    debounceUnits: _.debounce((e) => {
        this.productName = e.target.value;
        axios.post('/api/project/updateUnits', { productId: this.productId, units: this.units })
        .then((response) => {
          this.selectedInput = ''
          this.getProject(this.$route.params.tree).then(() => {
            this.root.selectAll("*").remove();
            this.buildGraph(this.states, this.edges)
          })
        })
      }, 500),
    debounceLocation: _.debounce((e) => {
        this.productName = e.target.value;
        axios.post('/api/project/updateLocation', { productId: this.productId, name: this.location })
        .then((response) => {
          this.selectedInput = ''
          this.getProject(this.$route.params.tree).then(() => {
            this.root.selectAll("*").remove();
            this.buildGraph(this.states, this.edges)
          })
        })
      }, 500)
  },
  mounted() {
    this.getProject(this.$route.params.tree).then(() => {
      this.buildGraph(this.states, this.edges)
    })
  }
};
</script>

<style>
  g.type-TK > rect {
  fill: #00ffd0;
  }

  text {
  font-weight: 300;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serf;
  font-size: 50%;
  }

  .node rect {
  stroke: #999;
  fill: #fff;
  stroke-width: 1px;
  }

  .edgePath path {
  stroke: #333;
  stroke-width: 0.5px;
  }
  #categoryHierarchy {
    height: 100%;
    width: 100%;
  }
  svg {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .workspace {
      border-style: solid;
      border-color: #babdc1;
      border-radius: 5px;
      border-width: thin;
      height: 80vh;
      width: 65%;
      float:right;
      margin-left: 1%;
      margin-top: 1%;
      margin-bottom: 1%;
      margin-right: 2%;
    }

  .toolbar{
      border-style: solid;
      border-color: #babdc1;
      border-radius: 5px;
      border-width: thin;
      height: 80vh;
      width: 30%;
      float: left;
      margin: 1%;
      padding: 1%;
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
  p {
    font-weight: 300;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serf;
    font-size: 80%;
  }

.select-style {
  border: 1px solid #ccc;
  width: 120px;
  border-radius: 3px;
  overflow: hidden;
  background: #fafafa url("/static/triangle.jpg") no-repeat 98% 50%;
  background-size: auto 40%;
  margin: 1%;
}

select {
  padding: 5px 8px;
  width: 130%;
  border: none;
  box-shadow: none;
  background: transparent;
  background-image: none;
  -webkit-appearance: none;
}

select:focus {
  outline: none;
}
.workspace_title {
  margin-left:2%;
  margin-top: 1%;
}

.add_button {
  color: #9ca1a8;
}

button.add_button:active {
  border-color: #9ca1a8;
}

button.add_button:focus {
  outline-color: #9ca1a8;
  outline-width: thin;
}

input {
  margin-top: 1%;
  margin-bottom: 2%;
  outline-color: #42b983;
  outline-width: medium;
}

.product_name {
  width: 100%;
}

.functional_unit {
  width: 40%;
  margin-right: 2%;
}

</style>
