import Message from "./Message";
import Loading from "./Loading";
import React from "react";
import { countryList } from "./countryList";
import { getData } from "./MakeRequest";

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
        const lower = input.toLowerCase();
        const words = lower.split(" ");

        // Intersect input string with country list

        const filteredArray = countryList.filter(
            (value) =>
                lower.includes(value.toLowerCase()) ||
                lower.includes(value.toLowerCase() + "?")
        );

        // If there's a valid country name, proceed with bot logic
        if (filteredArray.length > 0) {
            let country = filteredArray[0];
            console.log(country);
            const countryInfo = await getData(country);

            // Capital
            if (words.includes("capital")) {
                botResponse = `The capital of ${country} is ${countryInfo[0].capital}.`;
            }
            // Currency
            else if (words.includes("currency")) {
                const currency = Object.entries(countryInfo[0].currencies);
                botResponse = `In ${country}, the primary currency is ${currency[0][1].name} (${currency[0][0]}).`;
            }
            // Population
            else if (
                words.includes("population") ||
                (words.includes("how") &&
                    words.includes("many") &&
                    words.includes("people"))
            ) {
                botResponse = `The population of ${country} is ${countryInfo[0].population}.`;
            }
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

        const newObj = { bot: true, msg: botResponse };

        // Fake some reply time
        await new Promise((resolve) => setTimeout(resolve, 2000));

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
