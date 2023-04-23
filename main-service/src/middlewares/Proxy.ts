import {
    createProxyMiddleware,
    responseInterceptor,
} from "http-proxy-middleware";
import { Application } from "express";

class Proxy {
    public static mountProxy(_express: Application) {
        const proxy = createProxyMiddleware({
            target: "https://api.notion.com",
            changeOrigin: true,
            pathRewrite: {
                "^/notion-proxy": "", // remove base path
            },
        });

        const notionProxyHandler = (
            req: Request | any,
            res: Response | any,
            next: Function | any
        ) => {
            req.headers.set(
                "Authorization",
                "Basic MGFjYTk3MzItM2EyZC00ZmZmLTg5MjYtMmRmZDg5NjU3Yzg2OnNlY3JldF9jSHZTMWtNd0ZiZzVIcEZPOVlZN3h2eFJRWnIyQ2Iza3FBaXJnbXo4cVgy"
            );
            console.log(req.body);

            proxy(req, res, next);
        };

        _express.use("/notion-proxy", notionProxyHandler as any);
    }

    private static configRequestToGetNotionToken(
        req: Request,
        res: Response,
        next: Function
    ) {}
}

export default Proxy;
