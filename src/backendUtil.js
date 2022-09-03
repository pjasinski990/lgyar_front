const refreshAuth = async (refreshToken) => {
    const headers = {}
    headers['Authorization'] = 'Bearer ' + refreshToken
    headers['Access-Control-Allow-Origin'] = '*'

    const address = process.env.REACT_APP_BACKEND_ADDRESS + 'refresh_token'
    const res = await fetch(address, {
        headers: headers,
        mode: 'cors',
        body: null,
        method: 'get',
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
    const address = process.env.REACT_APP_BACKEND_ADDRESS + url
    headers['Authorization'] = 'Bearer ' + sessionStorage.getItem('access_token')
    headers['Access-Control-Allow-Origin'] = '*'

    const res = await fetch(address, {
        headers: headers,
        mode: 'cors',
        body: body,
        method: method,
    })

    // Try refreshing on unauthorized
    if (res.status === 403) {
        const clone = res.clone()
        clone.json()
            .then(async data => {
                if (data['error_message'].startsWith('The Token has expired on ')) {
                    const refresh_token = sessionStorage.getItem('refresh_token')
                    const didRefresh = await refreshAuth(refresh_token)
                    // Retry the original request on success
                    if (didRefresh) {
                        return makeBackendRequest(url, method, body, headers)
                    }
                    // Handle expired session
                    else {
                        console.log('session expired')
                        if (!!sessionStorage.getItem('access_token')) {
                            sessionStorage.clear()
                            window.location.replace('/login')
                        }
                    }
                }
            })
            .catch(err => console.error(err))
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

export const sessionLoadUserData = async () => {
    const retrieveUserRes = await makeBackendRequest('user', 'get', null, null)
        .catch(err => console.error(err))

    if (retrieveUserRes.ok) {
        const data = await retrieveUserRes.json()
        const localUser = {username: data.username, role: data.role}
        sessionStorage.setItem('user', JSON.stringify(localUser))
        sessionStorage.setItem('archive', JSON.stringify(data.previousPeriods))
        sessionStorage.setItem('active_period', JSON.stringify(data.activePeriod))
    }
    else {
        console.log(retrieveUserRes)
    }
}

export const sessionGetLoggedUser = () => {
    const user = sessionStorage.getItem('user')
    return user ? JSON.parse(user) : null
}

export const sessionGetArchive = () => {
    const archive = sessionStorage.getItem('archive')
    return archive ? JSON.parse(archive) : null
}

export const sessionGetActivePeriod = () => {
    const ap = sessionStorage.getItem('active_period')
    return ap ? JSON.parse(ap) : null
}

export const sessionSetActivePeriod = (newActivePeriod) => {
    sessionStorage.setItem('active_period', JSON.stringify(newActivePeriod))
}

export const sessionSetArchive = (newArchive) => {
    sessionStorage.setItem('archive', JSON.stringify(newArchive))
}

export const sessionSetTransactions = (newTransactions) => {
    const ap = JSON.parse(sessionStorage.getItem('active_period'))
    ap.transactions = newTransactions
    sessionSetActivePeriod(ap)
}

export const sessionSetEnvelopes = (newEnvelopes) => {
    const ap = JSON.parse(sessionStorage.getItem('active_period'))
    ap.envelopes = newEnvelopes
    sessionSetActivePeriod(ap)
}

export const sessionSetAvailableMoney = (newLimit) => {
    const ap = JSON.parse(sessionStorage.getItem('active_period'))
    ap.availableMoney = newLimit
    sessionSetActivePeriod(ap)
}

export const sessionSetStartDate = (newDate) => {
    const ap = JSON.parse(sessionStorage.getItem('active_period'))
    ap.startDate = newDate
    sessionSetActivePeriod(ap)
}

export const sessionSetEndDate = (newDate) => {
    const ap = JSON.parse(sessionStorage.getItem('active_period'))
    ap.endDate = newDate
    sessionSetActivePeriod(ap)
}
