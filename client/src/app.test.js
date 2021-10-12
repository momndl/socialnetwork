import App from "./app.js";
import { render, waitFor } from "@testing-library/react";

test("App renders correctly", async () => {
    fetch.mockResolvedValue({
        async json() {
            return {
                id: 1,
                first: "firstname",
                last: "lastname",
                url: "hello_pic_url",
            };
        },
    });
    const { container } = render(<App />);

    expect(container.querySelector("div")).toBe(null);
    // console.log("before wait for", container.innerHTML);

    await waitFor(() => expect(container.querySelector("div")).toBeTruthy());
    //console.log("after wait for", container.innerHTML);
    // console.log("container", container);
    expect(container.querySelector("img")).toBeTruthy();
    expect(container.querySelector("div").children.length).toBe(1);
});
