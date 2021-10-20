const spicedPg = require("spiced-pg");

const database = "socialnetwork";

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUserName, dbPassword } = require("./secrets");
    db = spicedPg(
        `postgres:${dbUserName}:${dbPassword}@localhost:5432/${database}`
    );
}

console.log(`[db] Connecting to: ${database}`);

// ==================== FUNCTIONS ======================

module.exports.regCheck = (email) => {
    return db.query(
        `SELECT users.password, users.id FROM users WHERE email = $1`,
        [email]
    );
}; // same

module.exports.addUser = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
};

module.exports.addResetCode = (email, code) => {
    return db.query(`INSERT INTO reset_codes (email, code) VALUES ($1, $2)`, [
        email,
        code,
    ]);
};

module.exports.getResetCode = (email) => {
    return db.query(
        ` 
    SELECT * FROM reset_codes
    WHERE email = ($1) ORDER BY created_at DESC LIMIT 1
    `,
        [email]
    );
};

module.exports.updatePassword = (password, email) => {
    return db.query(`UPDATE users SET password = ($1) WHERE email = ($2)`, [
        password,
        email,
    ]);
};

module.exports.getUser = (id) => {
    return db.query(
        `SELECT id, first, last, bio, pic_url FROM users WHERE id = ($1)`,
        [id]
    );
};

module.exports.updatePicUrl = (picUrl, id) => {
    return db.query(
        `
    UPDATE users SET pic_url = ($1) WHERE id = ($2)
    `,
        [picUrl, id]
    );
};

module.exports.updateBio = (bio, id) => {
    return db.query(
        `UPDATE users SET bio = ($1) WHERE id = ($2) RETURNING bio`,
        [bio, id]
    );
};

module.exports.findPeople = () => {
    return db.query(
        `SELECT id, first, last, pic_url FROM users ORDER BY id DESC LIMIT 3`
    );
};

module.exports.getMatchingUsersFirst = (searchTerm) => {
    return db.query(
        `SELECT id, first, last, pic_url FROM users WHERE first ILIKE ($1);`,
        [searchTerm + "%"]
    );
};

module.exports.getMatchingUsersLast = (searchTerm) => {
    return db.query(
        `SELECT id, first, last, pic_url FROM users WHERE last ILIKE ($1);`,
        [searchTerm + "%"]
    );
};

module.exports.checkFriendship = (loggedInUser, viewedProfile) => {
    return db.query(
        `
        SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)`,
        [loggedInUser, viewedProfile]
    );
};

module.exports.setFriendRequest = (loggedInUser, viewedProfile) => {
    return db.query(
        `
    INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2)
    `,
        [loggedInUser, viewedProfile]
    );
};

module.exports.updateFriendRequest = (loggedInUser, viewedProfile) => {
    return db.query(
        `
        UPDATE friendships SET accepted = true WHERE recipient_id = $1 AND sender_id = $2
        
    `,
        [loggedInUser, viewedProfile]
    );
};

module.exports.deleteFriendRequest = (loggedInUser, viewedProfile) => {
    return db.query(
        `
    DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
    `,
        [loggedInUser, viewedProfile]
    );
};

module.exports.getFriendsAndWannabes = (loggedInUser) => {
    return db.query(
        `SELECT users.id, first, last, pic_url, accepted, sender_id
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = ($1) AND sender_id = users.id)
    OR (accepted = true AND recipient_id = ($1) AND sender_id = users.id)
    OR (accepted = true AND sender_id = ($1) AND recipient_id = users.id)
    OR (accepted = false AND sender_id = ($1) AND recipient_id = users.id)`,
        [loggedInUser]
    );
};

module.exports.getLatestChatMessages = () => {
    return db.query(
        `SELECT groupchat.id, user_id, message, TO_CHAR(groupchat.created_at, 'HH24:MI DD.MM.YY') AS posted, users.first, users.last, users.pic_url FROM groupchat
JOIN users ON  users.id = user_id ORDER BY groupchat.id DESC LIMIT 10`,
        []
    );
};

module.exports.addChatMessage = (user_id, message) => {
    return db.query(
        `INSERT INTO groupchat (user_id, message) VALUES ($1, $2) RETURNING id, message,  TO_CHAR(created_at, 'HH24:MI DD.MM.YY') AS posted`,
        [user_id, message]
    );
};

module.exports.getOnlineUsers = (idArray) => {
    return db.query(
        `SELECT id, first, last, pic_url FROM users WHERE id = ANY($1)`,
        [idArray]
    );
};

module.exports.getLatestPrivateMessages = (loggedInUser) => {
    return db.query(
        `SELECT private_chat.id, sender_id, recipient_id, message, TO_CHAR(private_chat.created_at, 'HH24:MI DD.MM.YY') AS posted, users.first, users.last, users.pic_url FROM private_chat
JOIN users ON  (recipient_id = ($1) AND sender_id = users.id) OR (sender_id = ($1) AND recipient_id = users.id) ORDER BY private_chat.id ASC`,
        [loggedInUser]
    );
};
