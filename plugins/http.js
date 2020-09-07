import axios from 'axios'
import { mapKeysCamelCase } from '~/utilities/map_keys_convert.js'

class Http {
  constructor(axios, responseBuilder, ctx) {
    this._axios = axios
    this._responseBuilder = responseBuilder
    this._ctx = ctx
  }

  get(url, params, options = {}) {
    return this.request(
      Object.assign(
        {
          method: 'GET',
          url,
          params,
        },
        options
      )
    )
  }

  post(url, data, options = {}) {
    return this.request(
      Object.assign(
        {
          method: 'POST',
          url,
          data,
        },
        options
      )
    )
  }

  put(url, data, options = {}) {
    return this.request(
      Object.assign(
        {
          method: 'PUT',
          url,
          data,
        },
        options
      )
    )
  }

  delete(url, data, options = {}) {
    return this.request(
      Object.assign(
        {
          method: 'DELETE',
          url,
          data,
        },
        options
      )
    )
  }

  async request(options) {
    options.baseURL = process.env.API_BASE_URL
    const response = await this._axios(options).catch((err) => err.response)
    return this._responseBuilder(response)
  }
}

class Response {
  constructor(response) {
    this._rawResponse = response
    this._expectStatus = [200, 201, 202, 203, 204]
    this._buildResponse()
    return this
  }

  _buildResponse() {
    const { status, headers, data } = this._rawResponse || {}
    this.status = status
    this.headers = headers
    this.data = mapKeysCamelCase(data)
  }

  get error() {
    return !this._expectStatus.includes(this.status)
  }
}

export default (ctx, inject) => {
  inject('http', () => {
    const client = axios.create()
    return new Http(client, (res) => new Response(res), ctx)
  })
}
