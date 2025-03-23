import { useState } from "react";

export default function Chat({message = []}) {

    if (!message) {
        return (<div></div>);
    }

    return (
        <div>
            <div>
                {message[0].content}
            </div>
            <div>
                {message[1].content}
            </div>
        </div>
    )

}