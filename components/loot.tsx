// Just Learning

'use client'

import { useState, useEffect } from "react";

interface User {
    id: string;
    name: string;
    username: string;
    bio: string;
    image: string;
}

type USERTHING = {
    user: User;
    btnTitle: string;
}

// for the note. a good server response ranges from 200 - 299
// React.FC tells TypeScript its a functional component

const Loot: React.FC<USERTHING> = ({ user, btnTitle }) => {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        // specifically for fetch API
        const fetchData = async () => {
            await fetch('api')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok!') // response ok ranges from 200 - 299
                    }
                    return response.json();
                })
                .then(result => (
                    setData(result)
                ))
                .catch((e) => console.error(`There is a problem with your fetch operation: ${e.message}`))
        };

        fetchData();

    }, [])

    return (
        <>
            <p>UserID: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Btn: {btnTitle}</p>
            <p>{data}</p>
        </>
    )
}

export default Loot;