import {Router, Request, Response, NextFunction} from "express";
import postService from "./post.service";
import {Types} from "mongoose";
import {postSchema} from "./post.dto";
import {isValidate} from "../../midellware/validation";
const router = Router()

router.post("/",isValidate(postSchema), async (req: Request, res: Response,next:NextFunction) => {
    const createdPost = await postService.create(req.body,new Types.ObjectId("69ef5cd3441cbe9a423aeb23"));
    res.status(200).json({msg: "success",data: createdPost});
})
router.post("/add-reaction", async (req: Request, res: Response, next: NextFunction) => { 
    const {postId, reaction} = req.body
    await postService.addReaction({postId, reaction}, new Types.ObjectId("69ef5cd3441cbe9a423aeb23"))
    res.sendStatus(204);
})
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const {postId} = req.params
    const post = await postService.getpost(postId as unknown as Types.ObjectId)
    res.status(200).json({ msg: "success", data: post })
})

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const updatedPost = await postService.updatePost(id as unknown as Types.ObjectId, new Types.ObjectId("69ef5cd3441cbe9a423aeb23"), req.body)
    res.status(200).json({ msg: "success", data: updatedPost })
})

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    await postService.deletePost(id as unknown as Types.ObjectId, new Types.ObjectId("69ef5cd3441cbe9a423aeb23"))
    res.sendStatus(204)
})

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    const posts = await postService.getAllPosts(new Types.ObjectId("69ef5cd3441cbe9a423aeb23"))
    res.status(200).json({ msg: "success", data: posts })
})



export default router
