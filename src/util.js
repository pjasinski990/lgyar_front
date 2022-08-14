export const makeRequest = async (url, method, body, headers) => {
    if (!headers) {
        headers = {}
    }

    // TODO use correct backend address
    // const address = 'http://' + process.env.REACT_APP_BACKEND_ADDRESS + '/' + url
    const address = 'http://localhost:8081/' + url
    headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('access_token')
    headers['Access-Control-Allow-Origin'] = '*'
    return await fetch(address, {
        body: body,
        method: method,
        headers: headers
    })
}

export const makeFormRequest = async (url, data) => {
    let formBody = [];
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            formBody.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        }
    }
    formBody = formBody.join("&");
    const headers = {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}
    return makeRequest(url, 'post', formBody, headers)
}
