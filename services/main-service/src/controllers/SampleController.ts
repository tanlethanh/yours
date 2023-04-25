import { Request, Response } from "express";

class SampleController {
    public static getSample(req: Request, res: Response) {
        return res.json("Hello world")
    }

}

export default SampleController