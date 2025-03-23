import { useState } from "react";

export default function Chat({message = []}) {

    if (!message) {
        return (<div></div>);
    }

    return (
        <div className="bg-[#E9EDC9]">
            <div className="bg-[#CCD5AE]">
                {message[0].content}
            </div>
            <div>
                {message[1].content}
            </div>
        </div>
    )

}