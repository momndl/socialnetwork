import { useState } from "react";

export function useStatefulFields() {
    const [inputVals, setInputVals] = useState({});
    function handleInputChange({ target }) {
        setInputVals({
            // ...inputVals,
            [target.name]: target.value,
        });
        console.log("from useStatefulFileds values updated:", inputVals);
    }
    return [inputVals, handleInputChange];
}

// import and then const [inputVals, handleInputChange] = useStatefulFields()
