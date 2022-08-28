import Message from "./Message";

function Chat() {
    return (
        <div className="Chat">
            <Message />
            <Message />
            <div className="Chat-input-div">
                <input className="Chat-input-text" type="text" />
                <input className="Chat-input-submit" type="button" />
            </div>
        </div>
    );
}

export default Chat;
