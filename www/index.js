var number = document.getElementById('number')
var classes = document.getElementById('classes')

fetch('http://localhost:5000?class=2S').then((response) => {
    return response.json()
}).then((data) => {
    number.innerHTML = data.response
}).catch(() => {
    console.log("Error while fetching data from API")
})

fetch('http://localhost:5000/classes').then((response) => {
    return response.json()
}).then((data) => {
    console.log(data)
}).catch(() => {
    console.log("Error while fetching data from API")
})