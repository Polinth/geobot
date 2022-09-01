export function getData(country) {
    const baseUrl = "https://restcountries.com/v3.1/";
    return fetch(baseUrl + "/name/" + country).then((response) =>
        response.json()
    );
}
export function getDataExactMatch(country) {
    const baseUrl = "https://restcountries.com/v3.1/";
    return fetch(baseUrl + "/name/" + country + "?fullText=True").then(
        (response) => response.json()
    );
}
export function getRegionData(region) {
    const baseUrl = "https://restcountries.com/v3.1/";
    return fetch(baseUrl + "/region/" + region).then((response) =>
        response.json()
    );
}
