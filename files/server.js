
const http = require("http");
const fs = require("fs");

const fileName = "./users.json";

function readUsers() {
    return JSON.parse(fs.readFileSync(fileName, "utf8"));
}

function writeUsers(data) {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
}

function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    let body = "";

    req.on("data", (chunk) => {
        body += chunk;
    });

    req.on("end", () => {
        const url = req.url.split("?")[0];
        const parts = url.split("/");
        const method = req.method;

        let data;

        try {
            data = readUsers();
        } catch (error) {
            sendResponse(res, 500, {
                message: "Error reading users file."
            });
            return;
        }

        let userData = {};

        if (body !== "") {
            try {
                userData = JSON.parse(body);
            } catch (error) {
                sendResponse(res, 400, {
                    message: "Invalid JSON."
                });
                return;
            }
        }

        // POST /user
        if (method === "POST" && url === "/user") {
            if (!userData.name || !userData.email || userData.age === undefined) {
                sendResponse(res, 400, {
                    message: "Please provide name, age and email."
                });
                return;
            }

            for (let id in data.users) {
                if (data.users[id].email === userData.email) {
                    sendResponse(res, 400, {
                        message: "Email already exists."
                    });
                    return;
                }
            }

            data.lastId++;

            data.users[data.lastId] = {
                id: data.lastId,
                name: userData.name,
                age: userData.age,
                email: userData.email
            };

            writeUsers(data);

            sendResponse(res, 201, {
                message: "User added successfully."
            });
        }

        // PATCH /user/:id
        else if (method === "PATCH" && parts[1] === "user" && parts[2]) {
            const id = parts[2];

            if (!data.users[id]) {
                sendResponse(res, 404, {
                    message: "User ID not found."
                });
                return;
            }

            if (userData.name !== undefined) {
                data.users[id].name = userData.name;
            }

            if (userData.age !== undefined) {
                data.users[id].age = userData.age;
            }

            if (userData.email !== undefined) {
                for (let userId in data.users) {
                    if (userId !== id && data.users[userId].email === userData.email) {
                        sendResponse(res, 400, {
                            message: "Email already exists."
                        });
                        return;
                    }
                }

                data.users[id].email = userData.email;
            }

            writeUsers(data);

            sendResponse(res, 200, {
                message: "User updated successfully."
            });
        }

        // DELETE /user/:id
        else if (method === "DELETE" && parts[1] === "user" && parts[2]) {
            const id = parts[2];

            if (!data.users[id]) {
                sendResponse(res, 404, {
                    message: "User ID not found."
                });
                return;
            }

            delete data.users[id];

            writeUsers(data);

            sendResponse(res, 200, {
                message: "User deleted successfully."
            });
        }

        // GET /user
        else if (method === "GET" && url === "/user") {
            sendResponse(res, 200, data.users);
        }

        // GET /user/:id
        else if (method === "GET" && parts[1] === "user" && parts[2]) {
            const id = parts[2];

            if (!data.users[id]) {
                sendResponse(res, 404, {
                    message: "User not found."
                });
                return;
            }

            sendResponse(res, 200, data.users[id]);
        }

        else {
            sendResponse(res, 404, {
                message: "Route not found."
            });
        }
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
