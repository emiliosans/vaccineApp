

this.onload = carga;

function carga() {
    presentLoading();
    parseaCSV();
    parseaGraficos();
    
   // this.alert("hola");
}

async function openMenu() {
    await menuController.open();
}


async function presentLoading() {
    const loading = await loadingController.create({
      message: 'Cargando...',
      duration: 500
    });

    await loading.present();
}
  

var xhr = new XMLHttpRequest();

var xhrGraficos = new XMLHttpRequest();

//const URL_GIT = "https://github.com/owid/covid-19-data/blob/master/public/data/vaccinations/country_data/Spain.csv";
const URL_GIT2 = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/Spain.csv";
const URL_COVID_APP = "https://covid-vacuna.app/data/latest.json";
function parseaCSV() {
    //window.alert("HOLA QUE TAL");
    //parseaJSONMadrid();
    console.log("estoy en muestra reviews con el HTTPXMLRequest");
    xhr.open("GET", URL_COVID_APP);
    xhr.onreadystatechange = recibirCSV;
    xhr.send();
}

function parseaGraficos() {
    //window.alert("HOLA QUE TAL");
    //parseaJSONMadrid();
    console.log("estoy en muestra reviews con el HTTPXMLRequest");
    xhrGraficos.open("GET", URL_GIT2);
    xhrGraficos.onreadystatechange = recibirGraficos;
    xhrGraficos.send();
}



function parseaJSONMadrid() {
    let dosisDistribuidas = document.getElementById("dosisDistribuidas");
    fetch(URL_COVID_APP) //Aqui hacemos la peticion del numero de perros seleccionado
        .then(response => response.json()) //Cuando este lista, hacer esto.... RESPONSE es el cuerpo de la respuesta
        .then(data => {
            dosisDistribuidas.innerHTML = data[13].dosisEntregadas;
        });
}
// Return array of string values, or NULL if CSV string not well formed.
function CSVToArray2(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;

    var a = []; // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function (m0, m1, m2, m3) {

            // Remove backslash from \' in single quoted values.
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));

            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });

    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};


// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            (strMatchedDelimiter != strDelimiter)
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }


        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}

function recibirCSV() {
    if (xhr.readyState == 4) {
        console.log("respuesta rx");
        switch (xhr.status) {
            case 200:
                console.log("respuesta OK");
                let csv_raw = xhr.responseText;
                console.log("csv = " + csv_raw);
                let dosisDistribuidas = JSON.parse(csv_raw);
                //dosisDistribuidas.innerHTML = data[13].dosisEntregadas;
                let arrayCSV = CSVToArray2(csv_raw);
                //console.log("array csv = " + arrayCSV);
                console.log("JSON dosisDistribuidas= " + dosisDistribuidas);


                if (dosisDistribuidas.resultCount === null) {
                    window.alert("NO HAY DATOS DE VACUNACIÓN");
                    console.log("NO HAY DATOS DE VACUNACIÓN");
                } else {

                    console.log(dosisDistribuidas);
                    //muestraDatosVacunas(dosisDistribuidas);
                    muestraDatosVacunaMadrid(dosisDistribuidas);
                    muestraDatosVacunaEspaña(dosisDistribuidas);
                }
                break;
            case 400:
                console.log("COd respuesta " + xhr.status);
                console.log("respuesta INCORRECTA");
                window.alert("respuesta INCORRECTA");

                break;
            case 204:
                console.log("COd respuesta " + xhr.status);
                console.log("NO EXISTEN PAGINA CSV DE VACUNACION");
                window.alert("NO EXISTE PAGINA CSV DE VACUNACION");
                break;
            case 500:
                console.log("COd respuesta " + xhr.status);
                console.log("ERROR DEL SERVIDOR");
                window.alert("ERROR DEL SERVIDOR");
                break;
            default:
                console.log("Cod respuesta " + xhr.status);
        }
    }
}

function recibirGraficos () {
    if (xhrGraficos.readyState == 4) {
        console.log("respuesta rx");
        switch (xhrGraficos.status) {
            case 200:
                console.log("respuesta OK");
                let csv_raw = xhrGraficos.responseText;
                console.log("csv = " + csv_raw);
                //let dosisDistribuidas = JSON.parse(csv_raw);
                //dosisDistribuidas.innerHTML = data[13].dosisEntregadas;
                let arrayCSV = CSVToArray2(csv_raw);
                console.log("array csv = " + arrayCSV);
                //console.log("JSON dosisDistribuidas= " + dosisDistribuidas);


                if (dosisDistribuidas.resultCount === null) {
                    window.alert("NO HAY DATOS DE VACUNACIÓN");
                    console.log("NO HAY DATOS DE VACUNACIÓN");
                } else {

                    console.log(arrayCSV);
                    //muestraDatosVacunas(dosisDistribuidas);
                    //muestraDatosVacunaMadrid(dosisDistribuidas);
                   // muestraDatosVacunaEspaña(dosisDistribuidas);
                }
                break;
            case 400:
                console.log("COd respuesta " + xhrGraficos.status);
                console.log("respuesta INCORRECTA");
                window.alert("respuesta INCORRECTA");

                break;
            case 204:
                console.log("COd respuesta " + xhrGraficos.status);
                console.log("NO EXISTEN PAGINA CSV DE VACUNACION");
                window.alert("NO EXISTE PAGINA CSV DE VACUNACION");
                break;
            case 500:
                console.log("COd respuesta " + xhrGraficos.status);
                console.log("ERROR DEL SERVIDOR");
                window.alert("ERROR DEL SERVIDOR");
                break;
            default:
                console.log("Cod respuesta " + xhrGraficos.status);
        }
    }
}
function muestraDatosVacunaMadrid(dosis) {
    let poblacionMadrid = 6779888;

    let numeroFormateado = new Intl.NumberFormat().format(dosis[13].dosisEntregadas);
    let porcentajeEntregadas = trunc((dosis[13].dosisEntregadas*100)/poblacionMadrid, 3);
    let dosisAdministradas = new Intl.NumberFormat().format(dosis[13].dosisAdministradas);
    let porcentPoblacionMadridAdministradas = trunc((dosis[13].dosisAdministradas*100)/poblacionMadrid, 3);

    let porcentajeAdministradasSobreTotal = (dosis[13].dosisAdministradas*100) / dosis[13].dosisEntregadas;
    porcentajeAdministradasSobreTotal = trunc(porcentajeAdministradasSobreTotal, 2);

    let dosDosis = new Intl.NumberFormat().format(dosis[13].dosisPautaCompletada);
    let porcentajePautaCompletadas = trunc(((dosis[13].dosisPautaCompletada*100)/dosis[13].dosisAdministradas),2);

    let porcentajeCompletTotal = trunc(((dosis[13].dosisPautaCompletada*100)/poblacionMadrid),2);

    let dosisDistribuidas = document.getElementById("dosisDistribuidas");
    let porcentajeDosisEntregadas = document.getElementById("porcentajeDosisEntregadas");
    let dosisAdministradasTotal = document.getElementById("dosisAdministradas");
    let porcentajeMadridAdministradas = document.getElementById("porcentajePoblacionAdministradas");
    let porcentajeAdministradasTotal = document.getElementById("porcentajeAdministradasTotal");
    let pautaCompleta = document.getElementById("pautaCompleta");
    let porcentajeCompletas = document.getElementById("porcentajeCompletas");
    let porcenSobreTotalCompletas = document.getElementById("porcenSobreTotalCompletas");

    dosisDistribuidas.innerHTML = numeroFormateado;
    porcentajeDosisEntregadas.innerHTML = porcentajeEntregadas
    dosisAdministradasTotal.innerHTML = dosisAdministradas;
    porcentajeMadridAdministradas.innerHTML = porcentPoblacionMadridAdministradas;
    porcentajeAdministradasTotal.innerHTML = porcentajeAdministradasSobreTotal;
    pautaCompleta.innerHTML = dosDosis
    porcentajeCompletas.innerHTML = porcentajePautaCompletadas;
    porcenSobreTotalCompletas.innerHTML = porcentajeCompletTotal;


}

function muestraDatosVacunaEspaña(dosis) {
    let poblacionEs = 47329000;

    let numeroFormateado = new Intl.NumberFormat().format(dosis[19].dosisEntregadas);
    let porcentajeEntregadas = trunc((dosis[19].dosisEntregadas*100)/poblacionEs, 3);
    let dosisAdministradas = new Intl.NumberFormat().format(dosis[19].dosisAdministradas);
    let porcentPoblacionMadridAdministradas = trunc((dosis[19].dosisAdministradas*100)/poblacionEs, 3);

    let porcentajeAdministradasSobreTotal = (dosis[19].dosisAdministradas*100) / dosis[19].dosisEntregadas;
    porcentajeAdministradasSobreTotal = trunc(porcentajeAdministradasSobreTotal, 2);

    let dosDosis = new Intl.NumberFormat().format(dosis[19].dosisPautaCompletada);
    let porcentajePautaCompletadas = trunc(((dosis[19].dosisPautaCompletada*100)/dosis[19].dosisAdministradas),2);

    let porcentajeCompletTotal = trunc(((dosis[19].dosisPautaCompletada*100)/poblacionEs),2);

    let dosisDistribuidas = document.getElementById("dosisDistribuidasEs");
    let porcentajeDosisEntregadas = document.getElementById("porcentajeDosisEntregadasEs");
    let dosisAdministradasTotal = document.getElementById("dosisAdministradasEs");
    let porcentajeMadridAdministradas = document.getElementById("porcentajePoblacionAdministradasEs");
    let porcentajeAdministradasTotal = document.getElementById("porcentajeAdministradasTotalEs");
    let pautaCompleta = document.getElementById("pautaCompletaEs");
    let porcentajeCompletas = document.getElementById("porcentajeCompletasEs");
    let porcenSobreTotalCompletas = document.getElementById("porcenSobreTotalCompletasEs");

    dosisDistribuidas.innerHTML = numeroFormateado;
    porcentajeDosisEntregadas.innerHTML = porcentajeEntregadas
    dosisAdministradasTotal.innerHTML = dosisAdministradas;
    porcentajeMadridAdministradas.innerHTML = porcentPoblacionMadridAdministradas;
    porcentajeAdministradasTotal.innerHTML = porcentajeAdministradasSobreTotal;
    pautaCompleta.innerHTML = dosDosis
    porcentajeCompletas.innerHTML = porcentajePautaCompletadas;
    porcenSobreTotalCompletas.innerHTML = porcentajeCompletTotal;


}

function trunc (x, posiciones = 0) {
    var s = x.toString()
    var l = s.length
    var decimalLength = s.indexOf('.') + 1
    var numStr = s.substr(0, decimalLength + posiciones)
    return Number(numStr)
  }
function muestraDatosVacunas(arrayCSV) {

    let body = document.getElementById("body");
    let div = document.createElement("div");
    div.setAttribute("id", "hook");

    let span = document.createElement("span");
    span.innerHTML = "<b>" + arrayCSV[0] + "</b>";
    div.appendChild(span);
    let br = document.createElement("br");
    div.appendChild(br);

    let span2 = document.createElement("span");
    let pais = arrayCSV[4].substring(11, arrayCSV[4].length);
    span2.innerHTML = pais;
    div.appendChild(span2);
    let br2 = document.createElement("br");
    div.appendChild(br2);

    let span4 = document.createElement("span");
    span4.innerHTML = "<b>" + arrayCSV[1] + "</b>";
    div.appendChild(span4);
    let br4 = document.createElement("br");
    div.appendChild(br4);

    let span3 = document.createElement("span");
    span3.innerHTML = arrayCSV[arrayCSV.length - 4];
    div.appendChild(span3);
    let br3 = document.createElement("br");
    div.appendChild(br3);

    let span1 = document.createElement("span");
    span1.innerHTML = "<b>" + arrayCSV[2] + "</b>";
    div.appendChild(span1);
    let br1 = document.createElement("br");
    div.appendChild(br1);

    let span5 = document.createElement("span");
    span5.innerHTML = arrayCSV[arrayCSV.length - 3];
    div.appendChild(span5);
    let br5 = document.createElement("br");
    div.appendChild(br5);

    let span6 = document.createElement("span");
    span6.innerHTML = "<b>" + arrayCSV[3] + "</b>";
    div.appendChild(span6);
    let br6 = document.createElement("br");
    div.appendChild(br6);

    let span7 = document.createElement("span");
    span7.innerHTML = arrayCSV[arrayCSV.length - 2];
    div.appendChild(span7);
    let br7 = document.createElement("br");
    div.appendChild(br7);

    body.appendChild(div);
}