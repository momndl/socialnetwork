// useAuthSubmit will be a hook to handle auth submits for login and register
// it needs to be able to adopt to different urls that our fetch could go to
// it needs to know the values that should be send along
// and it needs to able to handle a potential error

import { useState } from "react";

export function useAuthSubmit(url, values) {
    const [error, setError] = useState(false);

    const handleSubmit = () => {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((resp) => resp.json())
            .then((data) =>
                data.success ? location.replace("/") : setError(true)
            );
    };
    return [error, handleSubmit];
}

// const[error, handleSubmit] = useAuthSubmit("/login.json", inputVals)
