
import {apiDomain} from '../utills/config';
import { URLSearchParams } from 'whatwg-url';

function fetchAPI(url, options) {
    const headers = new Headers(options && options.headers);
    const paramString = (new URLSearchParams(options.params)).toString();
    let URL = apiDomain + url + paramString;
    console.log(URL);
    return fetch(URL, {
        method: options.method,
        headers: headers,
        body: options.body,
    }).then(res =>{
        if (res.status === 200) {
            return Promise.resolve(res);
        } else {
            return Promise.reject(res);
        }
    }).then(res =>{
        if (res.status === 200) {
            return res.json().then(data => {
                return Promise.resolve({
                    status: res.status,
                    data
                });
            })
            
        } else {
            return Promise.reject(res);
        }
    })
}

export default fetchAPI;
