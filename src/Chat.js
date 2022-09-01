import Message from "./Message";
import Loading from "./Loading";
import React from "react";
import { countryList, regionList } from "./countryList";
import { getData, getDataExactMatch, getRegionData } from "./MakeRequest";

function Chat() {
    const [messages, setMessages] = React.useState([]);
    const [inputText, setInputText] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    function submitQuestion(e) {
        e.preventDefault();

        // If input empty just return
        if (inputText === "") return;

        // Add new message to chat
        const newObj = { bot: false, msg: inputText };
        setMessages((prevState) => [newObj, ...prevState]);
        processAnswer(inputText);
        setInputText("");
    }

    async function processAnswer(input) {
        setLoading(true);
        let botResponse = "Sorry, I don't understand.";
        let country;
        let countryInfo;
        let region;
        let regionInfo;
        const lower = input.toLowerCase();
        const words = lower.split(" ");

        // Intersect input string with country list
        const checkForCountry = countryList.filter(
            (value) =>
                lower.includes(value.toLowerCase()) ||
                lower.includes(value.toLowerCase() + "?")
        );

        // If there's a valid country name, fetch data for it
        if (checkForCountry.length > 0) {
            country = checkForCountry[0];
            try {
                countryInfo = await getDataExactMatch(country);
                if (countryInfo[0] === undefined) {
                    countryInfo = await getData(country);
                }
            } catch (error) {
                console.log(error);
            }
        }

        // Check for valid region name the same way
        const checkForRegion = regionList.filter(
            (value) =>
                lower.includes(value.toLowerCase()) ||
                lower.includes(value.toLowerCase() + "?")
        );
        // If there's a valid region name, fetch data for it
        if (checkForRegion.length > 0) {
            region = checkForRegion[0];
            try {
                regionInfo = await getRegionData(region);
                console.log(regionInfo);
            } catch (error) {
                console.log(error);
            }
        }

        // TODO: Region questions - "biggest country in europe", "how many people live in asia", etc

        // Capital of country X
        if (country && words.includes("capital")) {
            botResponse = `The capital of ${country} is ${countryInfo[0].capital}.`;
        }
        // Currency of country X
        else if (country && words.includes("currency")) {
            const currency = Object.entries(countryInfo[0].currencies);
            botResponse = `In ${country}, the primary currency is ${currency[0][1].name} (${currency[0][0]}).`;
        }
        // Population of country X
        else if (
            country &&
            (words.includes("population") ||
                (words.includes("how") &&
                    words.includes("many") &&
                    words.includes("people")))
        ) {
            botResponse = `The population of ${country} is ${countryInfo[0].population}.`;
        }

        // Flag of country
        else if (country && words.includes("flag")) {
            botResponse = (
                <p>
                    Here's the flag of {country}:{"   "}
                    <img
                        alt="flag"
                        height="50"
                        src={countryInfo[0].flags.png}
                    />
                </p>
            );
        }

        // Thank you
        if (lower.includes("thanks") || lower.includes("thank you")) {
            botResponse = `No problem!`;
        }
        // Who are you
        else if (
            (lower.includes("what") && lower.includes("name")) ||
            (lower.includes("who") && lower.includes("you"))
        ) {
            botResponse = `I am GeoBot. Pleased to meet you!`;
        }
        // Hello
        else if (
            lower.includes("hello") ||
            lower.includes("hi") ||
            lower.includes("hey")
        ) {
            botResponse = `Hi there! Do you have a question for me?`;
        }

        // TODO: Help response

        const newObj = { bot: true, msg: botResponse };

        // Fake some reply time
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setLoading(false);
        setMessages((prevState) => [newObj, ...prevState]);
    }

    return (
        <div className="Chat">
            <div className="Chat-messages" id="Chat-messages">
                {loading && <Loading />}
                {messages &&
                    messages.map((m) => {
                        return <Message bot={m.bot} msg={m.msg} />;
                    })}
            </div>
            <div className="Chat-input-div">
                <form className="Chat-input-form" action="">
                    <input
                        value={inputText}
                        className="Chat-input-text"
                        type="text"
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <input
                        value=">>"
                        className="Chat-input-submit"
                        type="submit"
                        onClick={submitQuestion}
                    />
                </form>
            </div>
        </div>
    );
}

export default Chat;
