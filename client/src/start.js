import ReactDOM from "react-dom";
import { Welcome } from "./welcome.js";
import { App } from "./app.js";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./redux/reducer.js";
import * as immutableState from "redux-immutable-state-invariant";

// createStore, applymiddleware from redux
// Provider from react-redux
// composeWithDevtools from redux-devtools-extension
// reducer from redux/reducer.js
// immutable state middleware *
// create store with reducer and the immutable state middleware and enable devtools
// wrap app in provider and pass provider the store -> by wrapping app in provider we make it possible for every component to use redux.
// like hotOrNot branch mostly
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

const elem = (
    <Provider store={store}>
        <App />
    </Provider>
);

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            // this means our user is not registered/logged in, we should see Welcome component
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            // this means our user IS registered/logged in!
            ReactDOM.render(elem, document.querySelector("main"));
        }
    });
