"use server"

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
    userId: string,
    username: string,
    name: string,
    image: string,
    bio: string,
    path: string
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; // 1 second delay between retries

export async function updateUser({
    userId,
    username,
    name,
    image,
    bio,
    path
}: Params): Promise<void> {
    await connectToDB();

    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            console.log(`Updating user with ID: ${userId}`);
            console.log(`Data: ${JSON.stringify({ username, name, image, bio })}`);

            const result = await User.findOneAndUpdate(
                { id: userId },
                {
                    username: username.toLowerCase(),
                    name,
                    bio,
                    image,
                    onboarded: true,
                },
                {
                    upsert: true,
                    new: true // Return the updated document
                },
            );

            console.log(`Update Result: ${JSON.stringify(result)}`);

            if (path === '/profile/edit') {
                revalidatePath(path);
            }

            // Operation succeeded, exit retry loop
            return;
        } catch (error: any) {
            console.error(`Error updating user: ${error.message}`);
            retries++;

            // If retries are not exhausted, wait before retrying
            if (retries < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
            }
        }
    }

    // All retries failed, throw an error
    throw new Error(`Failed to update user after ${MAX_RETRIES} attempts`);
}

export async function fetchUser(userID: string) {
    try {
        connectToDB();
        return await User
            .findOne({ id: userID })
        //.populate({
        //  path: 'communities',
        // model: Community
        //});
    } catch (error: any) {
        throw new Error(`Failed to fetch new user ${error.message}`);
    }

}

export async function fetchUserPosts(userID: string) {
    connectToDB();

    try {
        // Find all threads authored by the user with the user given ID

        // TODO: Populate community
        const threads = await User.findOne({ id: userID })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: 'Thread',
                    populate: {
                        path: 'author',
                        model: User,
                        select: 'name image id'
                    }
                }
            })

        return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch post: ${error.message}`)
    }
}

export async function fetchUsers({
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
}: {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}
) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, 'i');
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if (searchString.trim() !== "") {
            query.$or = [
                { username: { $regex: regex } },
                { name: { $regex: regex } }
            ]
        }

        const sortOptions = { createdAt: sortBy };
        const usersQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalUsersCount = await User.countDocuments(query);
        const users = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount * users.length;
        return { users, isNext };
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
}

export async function getActivity(userId: string) {
    try {
        connectToDB();
        // find all thread created by the user
        const userThreads = await Thread.find({ author: userId });

        // collect all the child thread ids (replies) replies from the children field
        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);

        // filter user reply
        const replies = await Thread.find({
            _id: { $in: childThreadIds },
            author: { $ne: userId }
        }).populate({
            path: 'author',
            model: 'User',
            select: 'name image _id',
        });

        return replies
    } catch (err: any) {
        throw new Error(`Failed to fetch activity: ${err.message}`)
    }
}