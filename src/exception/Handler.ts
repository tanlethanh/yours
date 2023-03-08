import Log from '../helpers/Log';
import Locals from '../providers/Locals';
import { Request, Response } from "express"

class Handler {
    /**
     * Handles all the not found routes
     */
    public static useNotFoundHandler(req: Request, res: Response): any {
        const apiPrefix = Locals.config().apiPrefix;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`);

        if (req.xhr || req.originalUrl.includes(`/${apiPrefix}/`)) {
            console.log("NOT FOUND HANDLER: ", req.originalUrl)
            return res.json({
                error: 'Page Not Found'
            });
        } else {
            res.status(404);
            return res.render('pages/error', {
                title: 'Page Not Found',
                error: []
            });
        }
    }

    /**
     * Register your error / exception monitoring
     * tools right here ie. before "next(err)"!
     */
    public static useLogErrors(err: Error, req: Request, res: Response, next: Function): any {
        Log.error(err.message);
        return next(err);
    }


    /**
     * Handles your api/web routes errors/exception
     */
    public static useClientErrorHandler(err: Error, req: Request, res: Response, next: Function): any {
        if (req.xhr) {
            Log.error(`Client error - ${err.message}`);
            return res.status(500).send({ error: 'Something went wrong!' });
        } else {
            return next(err);
        }
    }

    /**
     * Show undermaintenance page incase of errors
     */
    public static useErrorHandler(err: Error, req: Request, res: Response, next: Function): any {
        Log.error(`Server error - ${err.message}`);
        res.status(500);
        console.log(err)

        const apiPrefix = Locals.config().apiPrefix;
        if (req.originalUrl.includes(`/${apiPrefix}/`)) {

            if (err.name && err.name === 'UnauthorizedError') {
                const innerMessage = err.message ? err.message : undefined;
                return res.json({
                    error: [
                        'Invalid Token!',
                        innerMessage
                    ]
                });
            }

            return res.json({
                error: err
            });
        }
        

        return res.render('pages/error', { error: err.stack, title: 'Under Maintenance' });
    }

}

export default Handler;