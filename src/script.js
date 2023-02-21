const get = (endpoint, queryString) =>
    new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest()
        xhttp.open('POST', endpoint)

        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200)
                resolve(JSON.parse(this.responseText))
        }
        xhttp.onerror = (err) => reject(err)

        xhttp.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
        )
        xhttp.send(queryString)
    })

const getCountries = async () => get('/options.php', 'select=country')
const getAlloys = async () => get('/options.php', 'select=alloy')

const mapOptions = (options) =>
    options
        .map(({id, name}) => `<option value="${id}">${name}</option>`)
        .join('')

const send = (data) =>
    new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest()
        xhttp.open('POST', 'ajax.php?acc=add')

        xhttp.onreadystatechange = async function () {
            if (this.readyState == 4 && this.status == 200)
                resolve(JSON.parse(xhttp.responseText))
        }

        xhttp.setRequestHeader(
            'Content-type',
            'application/x-www-form-urlencoded'
        )

        const encoded = Object.keys(data)
            .map((key) => `${key}=${data[key]}`)
            .join('&')

        xhttp.send(encoded)
    })

const addCurrency = ({id, country, name, identifier, year, alloy}) => {
    const row = document.querySelector('#currencies-list').insertRow(1)
    row.id = `currency-${id}`
    row.innerHTML = `<td><img src='./flags/${country}.jpg'></td><td>${name}</td><td>${identifier}</td><td>${year}</td><td>${alloy}</td><td><img src='./flags/x.gif' onclick='removeCurrency(${id})'></td>`
}
const removeCurrency = async (id) => {
    get('/ajax.php?acc=remove', `id=${id}`)

    const currencies = document.querySelector('#currencies-list')
    currencies.deleteRow(
        Array.from(currencies.rows).findIndex(
            (row) => row.id === `currency-${id}`
        )
    )
}
const getCurrencies = async () =>
    (await get('/ajax.php?acc=get')).forEach(addCurrency)

const init = async () => {
    const countries = await getCountries()
    document.querySelector('#country').innerHTML = mapOptions(countries)

    const alloys = await getAlloys()
    document.querySelector('#alloy').innerHTML = mapOptions(alloys)

    const country = document.querySelector('#country')
    const name = document.querySelector('input[name=currency]')
    const identifier = document.querySelector('input[name=identifier]')
    const year = document.querySelector('input[name=year]')
    const alloy = document.querySelector('#alloy')
    document.querySelector('#add-currency').onclick = () =>
        send({
            country: country.value || '',
            name: name.value || '',
            identifier: identifier.value || '',
            year: year.value || 0,
            alloy: alloy.value || 0,
        }).then(addCurrency)

    await getCurrencies()
}

init()
