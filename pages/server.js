//const API_ENDPOINT = "http://192.168.1.30:3000"


let API_ENDPOINT


export function setApiEndpoint(url) {
    API_ENDPOINT = url
}

export function checkOnline(callback) {
    console.log("Checking if server is online")
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => { 
        if (xmlHttp.readyState === XMLHttpRequest.DONE) {
            if (xmlHttp.status === 200) {   // loaded
                console.log("server is online")
                callback(true)
            } else if (xmlHttp.status === 0) {  // Not loaded
                console.log("server is not online")
                callback(false)
            } else {
                throw new Error('Status call yielded status code ' + xmlHttp.status);
            }
        }
    }
    xmlHttp.timeout = 5000; // Set timeout to 4 seconds (4000 milliseconds)
    xmlHttp.open("GET", API_ENDPOINT + "/status", true); // true for asynchronous
    xmlHttp.send();
}

export function httpRequest(url, callback) {
    console.log("Getting " + url)
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => { 
        if (xmlHttp.readyState === XMLHttpRequest.DONE) {
            if (xmlHttp.status === 200) {   // loaded
                console.log("Got " + url)
                callback(xmlHttp.responseText)
            } else if (xmlHttp.status === 0) {  // Not loaded
                console.log("Server went offline")
            } else {
                throw new Error('Yielded status code ' + xmlHttp.status + " when requesting " + url);
            }
        }
    }
    xmlHttp.open("GET", API_ENDPOINT + url, true); // true for asynchronous
    xmlHttp.send();
}


export function submitPOST(username, data, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('POST', API_ENDPOINT, true);

    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.setRequestHeader('username', username);

    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                console.log("POSTed data to server")
                callback(false)
            } else  if (xmlHttp.status === 0) {
                console.error("Error POSTing data, status code " + xmlHttp.status + ". Most likely server offline")
                callback(xmlHttp.status)
            } else {
                console.error("Error POSTing data, status code " + xmlHttp.status)
                callback(xmlHttp.status)
            }
        }
    }
    xmlHttp.timeout = 5000;
    xmlHttp.send(data);
}