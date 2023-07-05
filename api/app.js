require('dotenv').config()
const cors = require('cors')
const fs = require('fs').promises
const express = require('express')
const fileupload = require('express-fileupload')

const {  storeNFT } = require('./metadata')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload())

app.post('/process', async(req, res) => {
   try{

    const name = req.body.name
    const description = req.body.description
    const price = req.body.price
    const image = req.files.image

    if (!name || !description || !price || !image) {
        return res
          .status(400)
          .send('name, description, and price must not be empty')
    }

    const filePath = `uploads/${image.name}`;

    await fs.writeFile(filePath, image.data);

    const result = await storeNFT(filePath, name, description);

    res.send(result)

   }catch(err){
       console.log(err)
   }
})

app.listen(9000, () => {
    console.log('API Server is running on port 9000')
} )