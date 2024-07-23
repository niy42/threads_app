"use client"

import { usePathname, useRouter } from "next/navigation";
import * as z from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
import { ThreadValidation } from '@/lib/validations/thread';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.actions";
import { useOrganization } from "@clerk/nextjs";

//import { updateUser } from "@/lib/actions/user.action";

interface User {
    user: {
        id: string;
        objectid: string;
        image: string;
        name: string;
        username: string;
        bio: string;
    };

    btnTitle: string;
}

type USERTHING = {
    userId: string;

}

function PostThread({ userId }: USERTHING) {
    const pathname = usePathname();
    const router = useRouter();
    const { organization } = useOrganization();

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            accountId: userId,
        }
    });

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        try {

            await createThread({
                text: values.thread,
                communityId: organization ? organization.id : null,
                path: pathname,
                author: userId
            });

            router.push('/')
        } catch (error: any) {
            throw new Error(`unable to create Thread: ${error.message}`)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 flex flex-col justify-start gap-10">

                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex flex-col w-full gap-3">
                            <FormLabel className="text-base-semibold text-light-2">
                                Content
                            </FormLabel>
                            <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 ">
                                <Textarea
                                    rows={15}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' className="bg-primary-500">
                    Post Thread
                </Button>
            </form>

        </Form>
    )
}
export default PostThread;