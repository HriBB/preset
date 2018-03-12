// @flow weak

const fs = require('fs')
const shortid = require('shortid')

const config = require('config')

const uploadFile = async (image) => {
  const { stream, filename: originalname, mimetype } = await image
  const filename = `${shortid.generate()}-${originalname.replace(' ', '-')}`
  const path = `${config.uploads.path}/${filename}`
  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on('finish', () => resolve({ filename, mimetype }))
      .on('error', reject),
  )
}

module.exports = uploadFile
