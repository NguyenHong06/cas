import axios from 'axios'
import { cloneDeep } from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { CANCEL_REQUEST_MESSAGE } from './constant'
import { apiDomain } from './config'
// import qs from 'qs'

const { CancelToken } = axios
window.cancelRequest = new Map()

export default function request(options) {
  let { data, url } = options
  const cloneData = cloneDeep(data)

  try {
    // let domain = ''
    let domain = apiDomain
    const urlMatch = url.match(/[a-zA-z]+:\/\/[^/]*/)
    if (urlMatch) {
      ;[domain] = urlMatch
      url = url.slice(domain.length)
    }

    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)

    for (const item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domain + url
  } catch (e) {
    console.log(e.message)
  }

  options.url = url
  options.params = cloneData
  options.withCredentials = true
  options.cancelToken = new CancelToken(cancel => {
    window.cancelRequest.set(Symbol(Date.now()), {
      pathname: window.location.pathname,
      cancel,
    })
  })

  return axios(options)
    .then(response => {
      const { statusText, status, data } = response
      let result = {}
      if (typeof data === 'object') {
        result = data
        if (Array.isArray(data)) {
          result.list = data
        }
      } else {
        result.data = data
      }

      return Promise.resolve({
        success: true,
        message: statusText,
        statusCode: status,
        ...result,
      })
    })
    .catch(error => {
      const { response, message } = error
      if (String(message) === CANCEL_REQUEST_MESSAGE) {
        return {
          success: false,
        }
      }

      let msg
      let statusCode

      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.detail || statusText
      } else {
        statusCode = 600
        msg = error.detail || 'Network Error'
      }

      /* eslint-disable */
      return Promise.reject({
        success: false,
        statusCode,
        message: msg,
      })
    })
}
