const axios = require('axios');
function guessAge(Name) {
    Name = Name.split(/[.\-_`~&!@*()+/$#,?]/).slice();

    let URL = `https://api.agify.io/?name=${Name[0]}`;
    return new Promise((resolve) => {
        axios.get(URL)
        .then((res) =>{
            resolve(res.data.age);
        })
    })
}

function generateAdvice(Name) {
    let URL = `https://api.adviceslip.com/advice`;
    return new Promise((resolve) => {
        axios.get(URL)
        .then((res) =>{
            resolve(res.data.slip.advice)
        })
    })
}

module.exports = {guessAge, generateAdvice}