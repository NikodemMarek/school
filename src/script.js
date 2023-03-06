const init = async () => {
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

    const countries = await getCountries()
    const alloys = await getAlloys()

    const mapOptions = (options) =>
        options
            .map(({id, name}) => `<option value="${id}">${name}</option>`)
            .join('')

    const send = (endpoint, data) =>
        new Promise((resolve, reject) => {
            const xhttp = new XMLHttpRequest()
            xhttp.open('POST', `ajax.php?acc=${endpoint}`)

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
        row.classList.add('currency')
        row.innerHTML = `<td><img src='./flags/${country}.jpg'></td><td>${name}</td><td>${identifier}</td><td>${year}</td><td>${alloy}</td><td><img src='./flags/x.gif'></td>`

        row.children[5].onclick = () => removeCurrency(id)

        row.ondblclick = (e) => {
            row.ondblclick = null

            const [iCountry, iName, iIdentifier, iYear, iAlloy] = [
                ...row.children,
            ].map((child) => child.innerHTML)

            const countryValue = iCountry
                .replace('<img src="./flags/', '')
                .replace('.jpg">', '')
            const countryIndex = countries.find(
                ({name}) => name === countryValue
            ).id

            const alloyIndex = alloys.find(({name}) => name === iAlloy).id

            row.innerHTML = `<td><select id='country'>${mapOptions(
                countries
            )}</select></td><td><input type='text' name='currency' value='${iName}'></td><td><input type='text' name='identifier' value='${iIdentifier}'></td><td><input type='number' name='year' value='${iYear}'></td><td><select id='alloy'>${mapOptions(
                alloys
            )}</select></td><td><button id="update-currency">update</button></td>`
            row.querySelector(`#country`).value = countryIndex
            row.querySelector(`#alloy`).value = alloyIndex

            const country = document.querySelector(
                `#currencies-list #currency-${id} #country`
            )
            const name = document.querySelector(
                `#currencies-list #currency-${id} input[name=currency]`
            )
            const identifier = document.querySelector(
                `#currencies-list #currency-${id} input[name=identifier]`
            )
            const year = document.querySelector(
                `#currencies-list #currency-${id} input[name=year]`
            )
            const alloy = document.querySelector(
                `#currencies-list #currency-${id} #alloy`
            )

            document.querySelector('#update-currency').onclick = () =>
                send('update', {
                    id,
                    country: country.value || '',
                    name: name.value || '',
                    identifier: identifier.value || '',
                    year: year.value || 0,
                    alloy: alloy.value || 0,
                }).then(updateCurrency)
        }
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
    const updateCurrency = async ({
        id,
        country,
        name,
        identifier,
        year,
        alloy,
    }) => {
        const row = document.querySelector(`#currencies-list #currency-${id}`)
        row.innerHTML = `<td><img src='./flags/${country}.jpg'></td><td>${name}</td><td>${identifier}</td><td>${year}</td><td>${alloy}</td><td><img src='./flags/x.gif'></td>`
        row.children[5].onclick = () => removeCurrency(id)

        row.ondblclick = (e) => {
            row.ondblclick = null

            init()

            const [iCountry, iName, iIdentifier, iYear, iAlloy] = [
                ...row.children,
            ].map((child) => child.innerHTML)

            const countryValue = iCountry
                .replace('<img src="./flags/', '')
                .replace('.jpg">', '')
            const countryIndex = countries.find(
                ({name}) => name === countryValue
            ).id

            const alloyIndex = alloys.find(({name}) => name === iAlloy).id

            row.innerHTML = `<td><select id='country'>${mapOptions(
                countries
            )}</select></td><td><input type='text' name='currency' value='${iName}'></td><td><input type='text' name='identifier' value='${iIdentifier}'></td><td><input type='number' name='year' value='${iYear}'></td><td><select id='alloy'>${mapOptions(
                alloys
            )}</select></td><td><button id="update-currency">update</button></td>`
            row.querySelector(`#country`).value = countryIndex
            row.querySelector(`#alloy`).value = alloyIndex

            const country = document.querySelector(
                `#currencies-list #currency-${id} #country`
            )
            const name = document.querySelector(
                `#currencies-list #currency-${id} input[name=currency]`
            )
            const identifier = document.querySelector(
                `#currencies-list #currency-${id} input[name=identifier]`
            )
            const year = document.querySelector(
                `#currencies-list #currency-${id} input[name=year]`
            )
            const alloy = document.querySelector(
                `#currencies-list #currency-${id} #alloy`
            )

            document.querySelector('#update-currency').onclick = () =>
                send('update', {
                    id,
                    country: country.value || '',
                    name: name.value || '',
                    identifier: identifier.value || '',
                    year: year.value || 0,
                    alloy: alloy.value || 0,
                }).then(updateCurrency)
        }
    }
    const getCurrencies = async () =>
        (await get('/ajax.php?acc=get')).forEach(addCurrency)

    document.querySelector('#country').innerHTML = mapOptions(countries)
    document.querySelector('#alloy').innerHTML = mapOptions(alloys)

    const country = document.querySelector('#country')
    const name = document.querySelector('input[name=currency]')
    const identifier = document.querySelector('input[name=identifier]')
    const year = document.querySelector('input[name=year]')
    const alloy = document.querySelector('#alloy')
    document.querySelector('#add-currency').onclick = () =>
        send('add', {
            country: country.value || '',
            name: name.value || '',
            identifier: identifier.value || '',
            year: year.value || 0,
            alloy: alloy.value || 0,
        }).then(addCurrency)

    await getCurrencies()
}

init()
