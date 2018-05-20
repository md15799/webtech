const express = require('express')
const { Seq, User, Product, TransportMode, EnergySource} = require('../db')
const router = express.Router()

const findInputs = async (product, states, edges, toDelete=0) => {
  if(!product || !product.Input.length) {
    return
  }
  else {
    let input_promises = []
    for (const input of product.Input) {
      if(toDelete == input.id) {
        Product.findOne({where: {id: input.id}}).then((p) => {
          product.removeInput(p)
        })
      }
      else {
        states[input.name] = { description: '',
                                style: '',
                                id: input.id,
                                production_location: input.production_location,
                                functional_unit: input.functional_unit,
                                units: input.units,
                                waste: input.waste,
                                energy: input.energy,
                                miles: input.miles,
                                energySource: input.energySourceId,
                                transportMode: input.transportModeId,
                                quantity: input.inputProducts.quantity,
                                unitsPerLoad: input.unitsPerLoad}
        edges.push([input.name, product.name])
        input_promises.push(Product.findAll({
          where: { id: input.id },
          include: [{ association:Product.Input, as:'inputs', through: { attributes: ['quantity']}},
                    { association:Product.Output, as:'outputs' },
                    { association:Product.EnergySource, as:'energySource'},
                    { association:Product.TransportMode, as:'transportMode'}]
        }))
      }
    }
    const products = await Promise.all(input_promises)

    let product_promises = []
    for(const prods of products){
      for (const prod of prods) {
        product_promises.push(findInputs(prod,states,edges))
      }
    }
    await Promise.all(product_promises)
  }
}

const findOutputs = async (product, states, edges, toDelete=0) => {
  if(!product || !product.Output.length) {
    return
  }
  else {
    let output_promises = []
    for (const output of product.Output) {
      if(toDelete == output.id) {
        Product.findOne({where: {id: output.id}}).then((p) => {
          product.removeOutput(p)
        })
      }
      else {
        states[output.name] = { description: '',
                                style: '',
                                id: output.id,
                                production_location: output.production_location,
                                functional_unit: output.functional_unit,
                                units: output.units,
                                waste: output.waste,
                                energy: output.energy,
                                miles: output.miles,
                                energySource: output.energySourceId,
                                transportMode: output.transportModeId,
                                quantity: output.outputProducts.quantity,
                                unitsPerLoad: output.unitsPerLoad}
        edges.push([product.name, output.name])
        output_promises.push(Product.findAll({
          where: { id: output.id },
          include: [{ association:Product.Input, as:'inputs'},
                    { association:Product.Output, as:'outputs' },
                    { association:Product.EnergySource, as:'energySource' },
                    { association:Product.TransportMode, as:'transportMode' }]
         }))
      }
    }
    const products = await Promise.all(output_promises)

    let product_promises = []
    for(const prods of products){
      for (const prod of prods) {
        product_promises.push(findInputs(prod,states,edges))
      }
    }
    await Promise.all(product_promises)
  }
}

router.post('/get', async (req, res) => {
  const id = req.body.id
  Product.findOne({
    where: { id: id },
    include: [{ association:Product.Input, as:'inputs'},
              { association:Product.Output, as:'outputs' },
              { association:Product.EnergySource, as:'energySource' },
              { association:Product.TransportMode, as:'transportMode' }]
  })
  .then((product) => {
    console.log(product.Input[0])
    let states = {[product.name]: { description: '',
                                    style: '',
                                    id: product.id,
                                    production_location: product.production_location,
                                    functional_unit: product.functional_unit,
                                    units: product.units,
                                    waste: product.waste,
                                    energy: product.energy,
                                    miles: product.miles,
                                    energySource: product.energySource.id,
                                    transportMode: product.transportMode.id,
                                    quantity: 1,
                                    unitsPerLoad: product.unitsPerLoad}}
    let edges = []
    findInputs(product, states, edges).then(()=> {
      findOutputs(product, states, edges).then(() => {
        res.json({ states: states, edges: edges })
      })
    })
  })
})

router.post('/new', (req, res) => {
  const id = req.body.id
  const product = req.body.project
  Product.create({
    name: product,
    userId: id
  })
  .then((product) => {
    res.json({ id: product.id })
  })
})

router.post('/getProjects', (req, res) => {
  const id = req.body.id
  Product.findAll( {where: { userId: id }})
  .then((projects) => {
    User.findOne({where: { id: id }})
    .then((user) => {
      res.json({ projects: projects, name: user.firstName })
    })
  })
})

router.post('/getAllProducts', (req, res) => {
  const Op = Seq.Op
  const exclude = req.body.exclude
  Product.findAll({
    where: {
      id: {
        [Op.notIn]: exclude
      }
    }
  }).then((products) => {
    TransportMode.findAll({}).then((transportModes) => {
      EnergySource.findAll({}).then((energySources) => {
        res.json({products: products, transportModes: transportModes, energySources: energySources})
      })
    })
  })
})

router.post('/addInput', (req, res) => {
  const productId = req.body.productId
  const inputId = req.body.inputId
  Product.findOne({where: { id: inputId }}).then((input) => {
    Product.findOne({where: { id: productId }}).then((product) => {
      product.addInput(input)
    })
  }).then((response) => {
    res.json({result: 'success'})
  })
})

router.post('/createInput', (req, res) => {
  const name = req.body.name
  const project = req.body.project
  Product.create({
    name: name
  }).then((input) => {
    Product.findOne({ where: {id: project} })
    .then((product) => {
      product.addInput(input).then(() => {
        res.json({result: 'success'})
      })
    })
  })
})

router.post('/createOutput', (req, res) => {
  const name = req.body.name
  const project = req.body.project
  Product.create({
    name: name
  }).then((output) => {
    Product.findOne({ where: {id: project} })
    .then((product) => {
      product.addOutput(output).then(() => {
        res.json({result: 'success'})
      })
    })
  })
})

router.post('/addOutput', (req, res) => {
  const productId = req.body.productId
  const outputId = req.body.outputId
  Product.findOne({where: { id: outputId }}).then((output) => {
    Product.findOne({where: { id: productId }}).then((product) => {
      product.addOutput(output)
    })
  }).then((response) => {
    res.json({result: 'success'})
  })
})

router.post('/deleteNode', (req, res) => {
  const productId = req.body.productId
  const projectId = req.body.projectId
  Product.findOne({
    where: { id: projectId },
    include: [{ association:Product.Input, as:'inputs' }, { association:Product.Output, as:'outputs' }]
  })
  .then((product) => {
    let states = {[product.name]: { description: '',
                                        style: '',
                                        id: product.id,
                                        production_location: product.production_location,
                                        functional_unit: product.functional_unit,
                                        units: product.units,
                                        waste: product.waste,
                                        energy: product.energy,
                                        miles: product.miles,
                                        energySource: product.energySource}}
    let edges = []
    findInputs(product, states, edges, productId).then(()=> {
      findOutputs(product, states, edges, productId).then(() => {
        res.json({ states: states, edges: edges })
      })
    })
  })
})

router.post('/updateName', (req,res) => {
  const id = req.body.productId
  const name = req.body.name
  Product.findOne( { where : {id: id } } ).then((actualProduct) => {
    Product.findOne( { where: { name: name } } ).then((withName) => {
      if (withName == null ) {
        actualProduct.name = name
        console.log(actualProduct)
        res.json({ name: name })
      }
      else {
        if(actualProduct.id == withName.id) {
          actualProduct.name = name
          res.json({ name: name })
        }
        else {
          res.status(401)
                 .json({ type: 'error',
                         message: 'Product with that name already exists.'
                       })
        }
      }
    })
  })
})

module.exports = router;
