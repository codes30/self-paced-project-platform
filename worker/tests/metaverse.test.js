import axios from "axios";
const BACKEND_URL = process.env.BACKEND_URL ?? "";
const WS_URL = process.env.WS_URL ?? "";

describe("Http endpoints", () => {
    test('User can Sign up', async () => {
        const username = "harkirat" + Math.random();
        const password = "123456";
    
        const response = await axios.post(`${BACKEND_URL}/signup`, {
            username, password
        });
    
        expect(response.data.sessionToken).toBeDefined();
        expect(response.data.userId).toBeDefined();
    });

    test('User can create a room', async () => {
        const username = "harkirat2" + Math.random();
        const password = "123456";
    
        const response = await axios.post(`${BACKEND_URL}/signup`, {
            username, password
        });
    
        const accessToken = response.data.sessionToken;

        const roomResponse = await axios.post(`${BACKEND_URL}/rooms`, {
            dimensions: "100x100",
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        expect(roomResponse.data.roomId).toBeDefined();        
    });
});

describe("Websocket events", () => {
    let ws1;
    let ws2;
    let user1;
    let user2;
    let room;
    let ws1Messages = [];
    let ws2Messages = [];

    beforeAll(async () => {
        let username = "harkirat" + Math.random(), password = "123123";
        let username2 = "harkirat2" + Math.random(), password2 = "123123";
        const response = await axios.post(`${BACKEND_URL}/signup`, {
            username, password
        });
    
        const accessToken = response.data.sessionToken;
        const userId = response.data.userId;

        const response2 = await axios.post(`${BACKEND_URL}/signup`, {
            username: username2, password: password2
        });
    
        const accessToken2 = response2.data.sessionToken;
        const userId2 = response2.data.userId;

        const roomResponse = await axios.post(`${BACKEND_URL}/rooms`, {
            dimensions: "100x100",
        }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        room = roomResponse.data.roomId;
        
        ws1 = new WebSocket(WS_URL);
        await new Promise((resolve) => {
            ws1.onopen = resolve;
        });
        ws2 = new WebSocket(WS_URL);
        await new Promise((resolve) => {
            ws2.onopen = resolve;
        });

        ws1.onmessage = ({ data }) => {
            ws1Messages.push(JSON.parse(data));
        };

        ws2.onmessage = ({ data }) => {
            console.log(data);
            ws2Messages.push(JSON.parse(data));
        };

        ws1.send(JSON.stringify({
            event: "join",
            data: {
                roomId: room,
                accessToken: accessToken
            }
        }));

        ws2.send(JSON.stringify({
            event: "join",
            data: {
                roomId: room,
                accessToken: accessToken2
            }
        }));

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (ws1Messages.length >= 1 && ws2Messages.length >= 1) {
                    resolve();
                    clearInterval(interval);
                }
            }, 1000);
        });

        user1 = {
            username,
            password,
            accessToken,
            userId,
            currentX: ws1Messages[0].data.x,
            currentY: ws1Messages[0].data.y
        };

        user2 = {
            username: username2,
            password: password2,
            accessToken: accessToken2,
            userId: userId2,
            currentX: ws2Messages[0].data.x,
            currentY: ws2Messages[0].data.y
        };

        ws1Messages.pop();
        ws2Messages.pop();
    });

    afterAll(() => {
        ws1.close();
        ws2.close();
    });

    test("User is not able to send wrong position to the backend", async () => {
        ws1.send(JSON.stringify({
            event: "position",
            data: {
                x: user1.currentX + 10,
                y: user1.currentY + 10
            }
        }));

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (ws1Messages.length >= 1) {
                    resolve();
                    clearInterval(interval);
                    const message = ws1Messages.pop();
                    expect(message.event).toBe("position-update");
                }
            }, 1000);
        });
    });

    test("User is able to broadcast right position to the backend", async () => {
        ws1.send(JSON.stringify({
            event: "position",
            data: {
                x: user1.currentX + 1,
                y: user1.currentY
            }
        }));

        await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (ws2Messages.length >= 1) {
                    resolve();
                    clearInterval(interval);
                    const message = ws2Messages.pop();
                    expect(message.event).toBe("position-update");
                    expect(message.data.x).toBe(user1.currentX + 1);
                }
            }, 1000);
        });
    });
});
