import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        //console.log("ok check");
        fetch("/find-people.json")
            .then((res) => res.json())
            .then((latestUsers) => {
                console.log("data in findpeople.js", latestUsers);
                setUsers(latestUsers);
            })
            .catch(console.log);
    }, []);

    useEffect(() => {
        if (searchTerm == "") {
            console.log("empty");
        } else {
            console.log("irgendwas mit searchTerm", searchTerm);
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
                    console.log(
                        "data after fetch find more poeple",
                        usersFound
                    );
                    setUsers(usersFound);
                })
                .catch(console.log);
        }
    }, [searchTerm]);

    return (
        <div className="findPeopleContainer">
            <input
                type="text"
                placeholder="find other users"
                onChange={(e) => setSearchTerm(e.target.value)}
                //defaultValue="find other users"
                // onKeyDown={updateGreeting}
                // onChange={(e) => setUser(e.target.value)}
            />
            <h2>latest users: </h2>
            {users &&
                users.map((user) => (
                    <div key={user.id}>
                        <Link to={`/user/${user.id}`}>
                            <img src={user.pic_url} />
                            <p>
                                {user.first} {user.last}
                            </p>
                        </Link>
                    </div>
                ))}
        </div>
    );
}
