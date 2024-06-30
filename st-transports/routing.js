const network = {
    "lines": [
        {
            "name": "UST 1",
            "stations": [
                "Evergreen",
                "Outpost",
                "Seacrestica",
                "Pagasa City",
                "Illyria"
            ]
        },
        {
            "name": "UST 2",
            "stations": [
                "Illyria",
                "Pagasa City",
                "Seacrestica",
                "Outpost",
                "Evergreen"
            ]
        },
        {
            "name": "UST 3",
            "stations": [
                "Malus",
                "Outpost"
            ]
        },
        {
            "name": "UST 4",
            "stations": [
                "Outpost",
                "Malus"
            ]
        }
    ],
    "stations": [
        {
            "name": "Evergreen",
            "lines": [
                "UST 1",
                "UST 2"
            ]
        },
        {
            "name": "Outpost",
            "lines": [
                "UST 1",
                "UST 2",
                "UST 3",
                "UST 4"
            ]
        },
        {
            "name": "Seacrestica",
            "lines": [
                "UST 1",
                "UST 2"
            ]
        },
        {
            "name": "Pagasa City",
            "lines": [
                "UST 1",
                "UST 2"
            ]
        },
        {
            "name": "Illyria",
            "lines": [
                "UST 1",
                "UST 2"
            ]
        },
        {
            "name": "Malus",
            "lines": [
                "UST 3",
                "UST 4"
            ]
        }
    ],
    "doublelines": [
        [
            "UST 1",
            "UST 2"
        ],
        [
            "UST 3",
            "UST 4"
        ]
    ]
};

function findRoutes(n,t,e){const s=(t,e)=>{for(const s of n.doublelines)if(s.includes(t)&&s.includes(e))return!0;return!1},l=(n,t,u,a=null)=>{if(n!==e)for(const e of o[n]){if(a&&s(a,e))continue;const o=i[e];for(let s=o.indexOf(n)+1;s<o.length;s++){const i=o[s];u.has(i)||(u.add(i),t.length&&t[t.length-1].line===e?t[t.length-1].stations.push(i):t.push({line:e,stations:[n,i]}),l(i,t,u,e),u.delete(i),t.length&&t[t.length-1].stations[t[t.length-1].stations.length-1]===i&&(2===t[t.length-1].stations.length?t.pop():t[t.length-1].stations.pop()))}}else h.push([...t])},o=n.stations.reduce(((n,t)=>(n[t.name]=t.lines,n)),{}),i=n.lines.reduce(((n,t)=>(n[t.name]=t.stations,n)),{}),h=[];return l(t,[],new Set([t])),h}