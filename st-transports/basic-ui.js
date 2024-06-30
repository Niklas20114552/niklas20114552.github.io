const blackbox = document.querySelector('blackbox');
const dialogbox = document.getElementById('stationbox');
const dialogtitle = document.getElementById('dialogtitle');
const personbox = document.getElementById('personbox');

let start = '';
let destination = '';
let routes = '';

if (localStorage.getItem('persons') == null || localStorage.getItem('persons') == '[]') {
    localStorage.setItem('persons', '[1]');
}

if (localStorage.getItem('start')) {
    start = localStorage.getItem('start');
    rebuildStart();
}

if (localStorage.getItem('destination')) {
    destination = localStorage.getItem('destination');
    rebuildStop();
}
// 1 → Adult (No Seacard)
// 2 → Adult (Seacard)
let persons;
try {
    persons = JSON.parse(localStorage.getItem('persons'));
} catch (e) {
    localStorage.setItem('persons', '[1]');
    persons = [1];
}

function removeItemOnce(arr, index) {
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function rebuildPersonsList() {
    const travelersList = document.getElementById('travelers-list');
    travelersList.innerHTML = '';

    for (var i = 0; i < persons.length; i++) {
        const entry = document.createElement('travelerentry');
        const delbutton = document.createElement('button');
        const delimg = document.createElement('img');
        delimg.src = 'delete.svg';
        delbutton.id = i;
        delbutton.name = 'traveler';
        if (persons.length == 1) {
            delbutton.disabled = true;
        }
        delbutton.appendChild(delimg);
        entry.appendChild(delbutton);
        if (persons[i] == 1) {
            entry.innerHTML += '1 Adult (No Seacard)';
        } else {
            entry.innerHTML += '1 Adult (With Seacard 50)';
        }
        travelersList.appendChild(entry);
    }
    const travelersbuttons = document.getElementsByName('traveler');
    for (var i = 0; i < travelersbuttons.length; i++) {
        travelersbuttons[i].addEventListener('click', function () {
            removeItemOnce(persons, this.id);
            localStorage.setItem('persons', JSON.stringify(persons));
            rebuildPersonsList();
            rebuildPersons();
        });
    }

}

document.getElementById('start-selector').addEventListener('click', () => {
    blackbox.style.display = 'block';
    dialogtitle.innerText = 'Select the Start';
    dialogbox.style.display = 'flex';
});

document.getElementById('stop-selector').addEventListener('click', () => {
    blackbox.style.display = 'block';
    dialogtitle.innerText = 'Select the Destination';
    dialogbox.style.display = 'flex';
});

document.getElementById('option-selector').addEventListener('click', () => {
    blackbox.style.display = 'block';
    personbox.style.display = 'flex';

    rebuildPersonsList()
});

document.getElementById('dialoginput').addEventListener('input', function () {
    if (this.value.slice(-1) === '\u2063') {
        this.value = this.value.slice(0, -1);
        blackbox.style.display = 'none';
        dialogbox.style.display = 'none';
        if (dialogtitle.innerText == 'Select the Destination') {
            destination = this.value;
            localStorage.setItem('destination', destination);
            rebuildStop();
        }
        else if (dialogtitle.innerText == 'Select the Start') {
            start = this.value;
            localStorage.setItem('start', start);
            rebuildStart();
        }
        this.value = '';
    }
});

document.getElementById('personadd').addEventListener('change', function () {
    persons.push(this.value);
    localStorage.setItem('persons', JSON.stringify(persons));
    this.value = 'Add a traveler';
    rebuildPersons();
    rebuildPersonsList();
})

document.getElementById('dialogback').addEventListener('click', () => {
    document.getElementById('dialoginput').value = '';
    blackbox.style.display = 'none';
    dialogbox.style.display = 'none';
});

document.getElementById('personback').addEventListener('click', () => {
    blackbox.style.display = 'none';
    personbox.style.display = 'none';
});

document.getElementById('route-button').addEventListener('click', () => {
    routes = findRoutes(network, start, destination);
    buildRoutes();
});

document.getElementById('swap').addEventListener('click', () => {
    const temp = start;
    start = destination;
    destination = temp;
    rebuildStart();
    rebuildStop();
});

function rebuildStart() {
    document.getElementById('start-selector').innerHTML = '';
    startsvg = document.createElement('img');
    startsvg.src = 'start.svg';
    document.getElementById('start-selector').appendChild(startsvg);
    if (start == '') {
        document.getElementById('start-selector').innerHTML += 'Start';
    } else {
        document.getElementById('start-selector').innerHTML += start;
    }
}

function rebuildStop() {
    document.getElementById('stop-selector').innerHTML = '';
    stopsvg = document.createElement('img');
    stopsvg.src = 'destination.svg';
    document.getElementById('stop-selector').appendChild(stopsvg);
    if (destination == '') {
        document.getElementById('stop-selector').innerHTML += 'Destination';
    } else {
        document.getElementById('stop-selector').innerHTML += destination;
    }
}

function rebuildPersons() {
    const optionSelector = document.getElementById('option-selector');
    optionSelector.innerHTML = '';
    personsvg = document.createElement('img')
    personstring = '1 traveler';
    if (persons.length == 1) {
        personsvg.src = 'person.svg';
    } else {
        personsvg.src = 'persons.svg';
        personstring = persons.length + ' travelers'
    }
    optionSelector.appendChild(personsvg);
    optionSelector.innerHTML += personstring;
}

function secondStringify(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    let minstring;
    if (mins == 1) {
        minstring = '1 minute';
    } else {
        minstring = mins + ' minutes';
    }
    if (secs > 0) {
        if (secs == 1) {
            return minstring + ' 1 second';
        } else {
            return minstring + ' ' + secs + ' seconds';
        }
    } else {
        return minstring; 
    }
}

function buildRoutes() {
    document.querySelector('main').innerHTML = '';
    for (var i = 0; i < routes.length; i++) {
        const routebox = document.createElement('routebox');

        const title = document.createElement('span');
        title.classList.add('routetitle');
        
        const flexbox = document.createElement('div');
        flexbox.classList.add('flexbox');
        
        let totaltraveltime = 0;
        
        for (var j = 0; j < routes[i].length; j++) {
            totaltraveltime += getTravelTimeForStops(getStops(routes[i][j].stations[0], routes[i][j].stations[1], routes[i][j].line));
        }
        
        for (var j = 0; j < routes[i].length; j++) {
            const linebox = document.createElement('linebox');
            linebox.style.width = (getTravelTimeForStops(getStops(routes[i][j].stations[0], routes[i][j].stations[1], routes[i][j].line)) / totaltraveltime * 100) + '%';
            linebox.innerText = routes[i][j].line.replace('UST', 'UltraStar');
            flexbox.appendChild(linebox);
        }
        
        title.innerText = secondStringify(totaltraveltime);
        routebox.appendChild(title);
        routebox.appendChild(flexbox);
        document.querySelector('main').appendChild(routebox);
    }
}

rebuildPersons();