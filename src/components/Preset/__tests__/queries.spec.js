
import fs from 'fs'
import path from 'path'

import { getModel, getListQuery } from '../utils'

const json = fs.readFileSync(path.resolve(__dirname, 'data.json'), 'utf8')
const data = JSON.parse(json)

describe('Preset', () => {
  describe('queries', () => {
    it('can get model data', () => {
      const model = getModel(data)
      expect(model.models).toBeDefined()
    })
    it('can create model list query', () => {
      const model = getModel(data)
      const query = getListQuery(model)
      expect(query).toBeDefined()
    })
  })
})
