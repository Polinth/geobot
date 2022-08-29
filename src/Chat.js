import Message from "./Message";
import React from "react";
import { countryList } from "./countryList";
import { getData } from "./MakeRequest";

function Chat() {
    const [messages, setMessages] = React.useState([]);

    const [inputText, setInputText] = React.useState("");

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
        let botResponse = "Sorry, I don't understand.";
        const lower = input.toLowerCase();

        // Intersect words in input string with country list
        const words = lower.split(" ");

        const filteredArray = countryList.filter(
            (value) =>
                words.includes(value.toLowerCase()) ||
                words.includes(value.toLowerCase() + "?")
        );

        // If there's a valid country name, proceed with bot logic
        if (filteredArray.length > 0) {
            let country = filteredArray[0];
            const countryInfo = await getData(country);
            if (words.includes("capital")) {
                botResponse = `The capital of ${country} is ${countryInfo[0].capital}.`;
            } else if (words.includes("currency")) {
                const currency = Object.entries(countryInfo[0].currencies);
                console.log(currency[0]);
                botResponse = `In ${country}, the primary currency is ${currency[0][1].name} (${currency[0][0]}).`;
            } else if (
                words.includes("population") ||
                (words.includes("how") &&
                    words.includes("many") &&
                    words.includes("people"))
            ) {
                botResponse = `The population of ${country} is ${countryInfo[0].population}.`;
            }
        }
        if (
            (lower.includes("what") && lower.includes("name")) ||
            (lower.includes("who") && lower.includes("you"))
        ) {
            botResponse = `I am GeoBot. Pleased to meet you!`;
        }
        if (
            lower.includes("hello") ||
            lower.includes("hi") ||
            lower.includes("hey")
        ) {
            // If no country, check for greeting phrases and respond
            botResponse = `Hi there! Do you have a question for me?`;
        }

        const newObj = { bot: true, msg: botResponse };
        setMessages((prevState) => [newObj, ...prevState]);
    }

    return (
        <div className="Chat">
            <div className="Chat-messages" id="Chat-messages">
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
