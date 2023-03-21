import ExpressApp from "./providers/Express.js";
import http from "http";
import Locals from "./providers/Locals.js";

const expressApp = new ExpressApp();
const server = http.createServer(expressApp.app);

// Start the server on the specified port
const PORT = Locals.config().PORT;
server
    .listen(PORT, () => {
        return console.log(
            `⚡️[server]: Server is running at https://localhost:${PORT}`
        );
    })
    .on("error", (_error: Error) => {
        return console.log("Error: ", _error.message);
    });
