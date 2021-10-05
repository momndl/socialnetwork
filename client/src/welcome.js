// function component
import { Registration } from "./registration.js";
import Logo from "./logo.js";

export default function Welcome() {
    return (
        <>
            <Logo />
            <h1>Welcome!</h1>
            <Registration />
        </>
    );
}
