import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [latestUsers, setLatestUsers] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        fetch("/find-people.json")
            .then((res) => res.json())
            .then((latestUsers) => {
                console.log("data in findpeople.js", latestUsers);
                setLatestUsers(latestUsers);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        if (searchTerm == "") {
            console.log("empty");
        } else {
            // const test = searchTerm.split(" ");
            // console.log("split test", test);
            const reqBody = { find: searchTerm };
            // change fetch back to "/find-more-people.json"
            fetch("/find-more-people.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reqBody),
            })
                .then((res) => res.json())
                .then((usersFound) => {
                    // console.log(
                    //     "data after fetch find more poeple",
                    //     usersFound
                    // );
                    setUsers(usersFound);
                })
                .catch(console.log);
        }
    }, [searchTerm]);

    return (
        <section className="findPeopleContainer">
            {latestUsers && (
                <div className="latestPeopleResults">
                    <h2>latest users: </h2>
                    {latestUsers &&
                        latestUsers.map((user) => (
                            <div className="findResult" key={user.id}>
                                <Link to={`/user/${user.id}`}>
                                    <img src={user.pic_url} />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </Link>
                            </div>
                        ))}
                </div>
            )}

            <div className="findPeopleResults">
                <div>
                    <h2>find users: </h2>
                    <input
                        type="text"
                        placeholder="find other users"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        //defaultValue="find other users"
                        // onKeyDown={updateGreeting}
                        // onChange={(e) => setUser(e.target.value)}
                    />
                </div>
                {users &&
                    users.map((user) => (
                        <div className="findResult" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <img src={user.pic_url} />
                                <p>
                                    {user.first} {user.last}
                                </p>
                            </Link>
                        </div>
                    ))}
            </div>
        </section>
    );
}
