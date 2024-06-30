const blackbox = document.querySelector('blackbox');
const dialogbox = document.getElementById('stationbox');
const dialogtitle = document.getElementById('dialogtitle');
const personbox = document.getElementById('personbox');
const routebox = document.getElementById('routebox');

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
    if (start == '' || destination == '') {
        document.querySelector('main').innerText = 'Please select a start and a destination.';
    } else if (start != destination) {
        routes = findRoutes(network, start, destination);
        buildRoutes();
    } else {
        document.querySelector('main').innerText = 'Start and destination are identical.';
    }
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

function calcPrice() {
    let price = 0;
    for (var i = 0; i < persons.length; i++) {
        price += network['prices'][persons[i]];
    }
    return price;
}

function buildRoutes() {
    document.querySelector('main').innerHTML = '';
    const searchtitle = document.createElement('span');
    searchtitle.innerText = 'Search results for: ' + start + ' → ' + destination + ':';
    searchtitle.classList.add('searchtitle')
    document.querySelector('main').appendChild(searchtitle)
    for (var i = 0; i < routes.length; i++) {
        const routebox = document.createElement('routebox');
        routebox.id = i;

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
            linebox.title = routes[i][j].stations[0] + ' → ' + routes[i][j].stations[1];
            flexbox.appendChild(linebox);
        }

        title.innerText = secondStringify(totaltraveltime);

        const pricespan = document.createElement('span');
        pricespan.innerText = "Price: " + calcPrice() + ' ';
        pricespan.classList.add('pricetext');
        const greenspan = document.createElement('span');
        greenspan.classList.add('green-text');
        greenspan.innerHTML = 'Emeralds';
        pricespan.appendChild(greenspan);

        routebox.appendChild(title);
        routebox.appendChild(flexbox);
        routebox.appendChild(pricespan);
        document.querySelector('main').appendChild(routebox);
    }

    const groutes = document.querySelectorAll('routebox');
    for (var i = 0; i < groutes.length; i++) {
        groutes[i].addEventListener('click', function () {
            const route = routes[this.id];
            const button = document.createElement('button');
            button.innerText = 'Back';
            button.id = 'routeback';
            document.getElementById('routetitle').innerHTML = '';
            document.getElementById('routetitle').appendChild(button);
            document.getElementById('routetitle').innerHTML += 'Connection ' + start + ' → ' + destination + ':';
            
            document.querySelectorAll('leftbox').forEach(function (a) {a.remove()});
            const changeheres = document.getElementsByClassName('changehere');
            for (var c = 0; c < changeheres.length; c++) {
                changeheres[c].delete();
            }

            for (var j = 0; j < route.length; j++) {
                const leftbox = document.createElement('leftbox');

                const startstation = document.createElement('p');
                startstation.classList.add('stationtitle');
                const platform = document.createElement('span');
                platform.classList.add('platform');
                platform.innerText = 'Platform ' + getPlatformOfStop(route[j].stations[0], route[j].line);
                startstation.appendChild(platform);
                startstation.innerHTML += route[j].stations[0];
                leftbox.appendChild(startstation);

                const train = document.createElement('span');
                train.classList.add('traintitle');
                train.innerText = route[j].line.replace('UST', 'UltraStar') + ' (' + route[j].line + ')';
                leftbox.appendChild(train);

                const time = document.createElement('p');
                time.classList.add('stationtitle');
                time.innerText = 'Travel time: ' + secondStringify(getTravelTimeForStops(getStops(route[j].stations[0], route[j].stations[1], route[j].line)));
                leftbox.appendChild(time);

                const operator = document.createElement('span');
                operator.classList.add('operator');
                operator.innerText = 'Operated by Seacrestica Transports Outpost.';
                leftbox.appendChild(operator);

                const stopstation = document.createElement('p');
                stopstation.classList.add('stationtitle');
                const stop_platform = document.createElement('span');
                stop_platform.classList.add('platform');
                stop_platform.innerText = 'Platform ' + getPlatformOfStop(route[j].stations[1], route[j].line);
                stopstation.appendChild(stop_platform);
                stopstation.innerHTML += route[j].stations[0];
                leftbox.appendChild(stopstation);

                routebox.appendChild(leftbox);

                if (j < route.length - 1) {
                    const change = document.createElement('span');
                    change.classList.add('changehere');
                    change.innerText = 'Change train here';
                    routebox.appendChild(change);
                }
            }
            blackbox.style.display = 'block';
            routebox.style.display = 'block';
            document.getElementById('routeback').addEventListener('click', () => {
                blackbox.style.display = 'none';
                routebox.style.display = 'none';
            });
        });
    }

}

rebuildPersons();