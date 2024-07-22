import *  as z from 'zod';


// choose any 

export const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3, { message: 'Minimum 3 characters' }).max(30),
    username: z.string().min(3).max(30),
    bio: z.string().min(3).max(1000),
})

export const _UserValidation = z.object({
    profile_photo: z.string(),
    name: z.string().min(3, "Name is required"),
    username: z.string().nonempty("Username is required"),
    bio: z.string().optional(),
});
