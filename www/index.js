// Get elements
var number = document.getElementById('number')
var classes = document.getElementById('classes')

let cookies = { class: null }

// Read data from cookie files
let x = document.cookie.split(' ')
let i = -1;
for (i = 0; i < x.length; i++) {
    if (x[i].split('=')[0] == 'class') {
        cookies.class = x[i].split('=')[1]
        break;
    }
}

// Handle class selector click and fetch new data
function handleClick(arg) {


    // Fetch data
    fetch('http://localhost:5000?class=' + arg).then((response) => {
        return response.json()
    }).then((data) => {
        // Set number to newly received data
        number.innerHTML = data.response

        // Update variables
        document.cookie = 'class=' + arg
        cookies.class = arg

        // Set selector to selected class
        document.getElementById('classes').childNodes.forEach((element) => {
            element.classList.remove('class-selected')
        })
        document.getElementById(arg).classList.add('class-selected')
    }).catch(() => {
        console.log("Error while fetching data from API")
    })
}

// Fetch lucky number for specific class from API
fetch('http://localhost:5000?class=' + cookies.class).then((response) => {
    return response.json()
}).then((data) => {
    number.innerHTML = data.response
}).catch(() => {
    console.log("Error while fetching data from API")
})

// Fetch class list from API
fetch('http://localhost:5000/classes').then((response) => {
    return response.json()
}).then((data) => {
    data.response.forEach(element => {
        classes.innerHTML = classes.innerHTML + '<button class="class-selector" id="' + element + '" onclick=\'handleClick("' + element + '")\'>' + element + '</button>'
    });

    // After fetchin classes list, set class selector to last selected class
    document.getElementById(cookies.class).classList.add('class-selected')
}).catch((error) => {
    console.log("Error while fetching data from API")
})