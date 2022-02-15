import { render, fireEvent } from "@testing-library/react";
import ProfilePic from "./profilepic";

test("shows default.jpg in the absence of a url prop", () => {
    const { container } = render(<ProfilePic />);

    expect(container.querySelector("img").src).toBe("default.jpg");
    expect(
        container.querySelector("img").getAttribute("src").toBe("default.jpg")
    );
});

test("sets src correctly", () => {
    const { container } = render(<ProfilePic url="schnapp.jpg" />);

    expect(container.querySelector("img").src).toBe("default.jpg");
    expect(
        container.querySelector("img").getAttribute("src").toBe("default.jpg")
    );
});

test("attaches click handler correctly", () => {
    const onClickMock = jest.fn(() => console.log("clicked!"));
    const { container } = render(<ProfilePic onClick={onClickMock} />);

    fireEvent.click(container.querySelector("img"));

    expect(onClickMock.mock.calls.length).toBe(1);
});
