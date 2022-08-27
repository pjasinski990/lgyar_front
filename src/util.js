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
    if (!res.ok) {
        return false
    }

    const data = await res.json()
    const aToken = data['access_token']
    const rToken = data['refresh_token']
    if (aToken && rToken) {
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
            const didRefresh = await refreshAuth(refresh_token)
            // Retry the original request on success
            if (didRefresh) {
                return makeBackendRequest(url, method, body, headers)
            }
            // Handle expired session
            else {
                if (!!sessionStorage.getItem('access_token')) {
                    sessionStorage.clear()
                    window.location.replace('/login')
                }
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
