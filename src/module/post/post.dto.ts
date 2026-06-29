import z from "zod"
import {BadRequestException, SYS_REACTION} from "../../common";

export interface CreatePostDTO{
    content?: string,
    imge?:string[]
}

export const postSchema = z.object({
    content: z.string().optional(),
    imge: z.array(z.string()).optional(),
}).refine((data)=>{
    const {content, imge} = data;
    if(!content&&(imge?.length==0||!imge)){
        throw new BadRequestException(`Content or imge doesn't exist!`);
    }
    return true
})

export interface AddReactionDTO{
    postId: string,
    reaction: SYS_REACTION
}