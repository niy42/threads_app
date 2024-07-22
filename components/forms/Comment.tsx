"use client"

import { usePathname, useRouter } from "next/navigation";
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { CommentValidation } from '@/lib/validations/thread';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";
//import { createThread } from "@/lib/actions/thread.actions";


type Props = {
    threadId: string,
    currentUserImg: string,
    currentUserId: string,
}

export default function Comment({ threadId, currentUserImg, currentUserId }: Props) {
    const pathname = usePathname();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: '',
        }
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        try {
            await addCommentToThread(
                threadId,
                values.thread,
                JSON.parse(currentUserId),
                pathname,
            );

            form.reset();
        } catch (e: any) {
            throw new Error(`Unable to add comment: ${e.message}`)
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">

                    <FormField
                        control={form.control}
                        name="thread"
                        render={({ field }) => (
                            <FormItem className="flex w-full items-center gap-3">
                                <FormLabel >
                                    <Image
                                        src={currentUserImg}
                                        alt='Profile image'
                                        width={48}
                                        height={48}
                                        className='rounded-full object-cover'
                                    />
                                </FormLabel>
                                <FormControl className="border-none bg-transparent">
                                    <Input
                                        className="no-focus text-light-1 outline-none"
                                        type="text"
                                        placeholder="Comment..."
                                        {...field}
                                    />
                                </FormControl>

                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="comment-form_btn">Reply</Button>
                </form>
            </Form>
        </div >
    )
}