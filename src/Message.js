function Message(props) {
    return (
        <div className={props.bot ? "Message-right" : "Message-left"}>
            {props.msg}
        </div>
    );
}

export default Message;
