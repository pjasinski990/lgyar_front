import {toast} from "react-toastify";

const refreshAuth = async (refreshToken) => {
    const headers = {}
    headers['Authorization'] = 'Bearer ' + refreshToken
    headers['Access-Control-Allow-Origin'] = '*'
    // TODO use correct backend address
    const address = 'http://localhost:8081/refresh_token'

    const res = await fetch(address, {
        body: null,
        method: 'get',
        headers: headers
    })
    console.log('from refreshAuth - refresh res: ', res)
    if (!res.ok) {
        console.log('from refreshAuth - refresh res was nok (status ', res.status, ') - returning false')
        return false
    }

    const data = await res.json()
    const aToken = data['access_token']
    const rToken = data['refresh_token']
    if (aToken && rToken) {
        console.log('refresh successful')
        console.log('new aToken: ', aToken)
        console.log('new rToken: ', rToken)
        sessionStorage.setItem('access_token', aToken)
        sessionStorage.setItem('refresh_token', rToken)
        return true
    }
    return false
}

export const makeBackendRequest = async (url, method, body, headers) => {
    if (!headers) {
        headers = {}
    }

    console.log('fetching ', url, ' with tokens: \n', sessionStorage.getItem('access_token'), '\n', sessionStorage.getItem('refresh_token'))

    // TODO use correct backend address
    // const address = 'http://' + process.env.REACT_APP_BACKEND_ADDRESS + '/' + url
    const address = 'http://localhost:8081/' + url
    headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('access_token')
    headers['Access-Control-Allow-Origin'] = '*'

    const res = await fetch(address, {
        body: body,
        method: method,
        headers: headers
    })

    // Try refreshing on unauthorized
    if (res.status === 403) {
        const clone = res.clone()
        const data = await clone.json()
        if (data['error_message'].startsWith('The Token has expired on ')) {
            const refresh_token = sessionStorage.getItem('refresh_token')
            console.log('tried to fetch ', address, ' but the token has expired. refreshing with token ', refresh_token)
            const didRefresh = await refreshAuth(refresh_token)
            console.log('refresh status: ', didRefresh)
            if (didRefresh) {
                return makeBackendRequest(url, method, body, headers)
            }
            else {
                console.log('refresh was unsuccessful (status ', res.status, ')')
                localStorage.clear()
                // window.location.replace('/login')
                toast.error('Your session has expired. Please log in.')
            }
        }
    }
    return res
}

export const makeBackendFormRequest = async (url, data) => {
    let formBody = []
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formBody.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        }
    }
    formBody = formBody.join("&");
    const headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
    return makeBackendRequest(url, 'post', formBody, headers)
}
