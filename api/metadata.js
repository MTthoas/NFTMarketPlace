const sharp = require('sharp')
const { faker } = require('@faker-js/faker')
const { NFTStorage, File } = require('nft.storage')
const fs = require('fs')
const path = require('path')
const mime = require('mime')


async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}

const storeNFT = async (filePath, name, description) => {
    try {
      // load the file from disk
      const image = await fileFromPath(filePath)

      // create a new NFTStorage client using our API key
      const nftstorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY });
  
      // call client.store, passing in the image & metadata
      return nftstorage.store({
        name,
        description,
        image: new File([filePath], name, { type: 'image/jpg' }),
      });
    } catch (err) {
      console.log(err);
      throw new Error('Failed to store NFT');
    }
  };
  


const attributes = {
  weapon: [
    'Stick',
    'Knife',
    'Blade',
    'Club',
    'Ax',
    'Sword',
    'Spear',
    'Halberd',
  ],
  environment: [
    'Space',
    'Sky',
    'Deserts',
    'Forests',
    'Grasslands',
    'Mountains',
    'Oceans',
    'Rainforests',
  ],
  rarity: Array.from(Array(6).keys()),
}


const toMetadata = ({ id, name, description, price, image }) => ({
  id,
  name,
  description,
  price,
  image,
  demand: faker.datatype.number({
    'min': 10,
    'max': 100
    }),
  attributes: [
    {
      trait_type: 'Environment',
      value: attributes.environment.sort(() => 0.5 - Math.random())[0],
    },
    {
      trait_type: 'Weapon',
      value: attributes.weapon.sort(() => 0.5 - Math.random())[0],
    },
    {
      trait_type: 'Rarity',
      value: attributes.rarity.sort(() => 0.5 - Math.random())[0],
    },
    {
      display_type: 'date',
      trait_type: 'Created',
      value: Date.now(),
    },
    {
      display_type: 'number',
      trait_type: 'generation',
      value: 1,
    },
  ],
})
const toWebp = async (image) => await sharp(image).resize(500).webp().toBuffer()


exports.toWebp = toWebp
exports.toMetadata = toMetadata
exports.storeNFT = storeNFT
