export function getData(country) {
    const baseUrl = "https://restcountries.com/v3.1/";
    return fetch(baseUrl + "/name/" + country).then((response) =>
        response.json()
    );
}
