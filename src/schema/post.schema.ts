import { object, string, ref } from "yup";

const payload = {
    body: object({
        title: string().required('Title is required'),
        body: string()
            .required('Body is required')
            .min(120, 'Body is too short - minimum 120 character required')
    })
}

const params = {
    params: object({
        postId: string().required('postId is required')
    })
}

export const createPostSchema = object({
    ...payload
})

export const updatePostSchema = object({
    ...params,
    ...payload
})
export const deletePostSchema = object({
    ...params
})
