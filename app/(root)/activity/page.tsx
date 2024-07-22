import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.action";
import Link from "next/link";
import Image from "next/image";

async function Activity() {
    try {
        const user = await currentUser();
        console.log(user);

        if (!user) return null;

        const userInfo = await fetchUser(user.id);

        if (!userInfo?.onboarded) {
            redirect('/onboarding');
            return null; // Ensure the function exits after redirecting
        }

        // getActivity
        const activity = await getActivity(userInfo._id);

        console.log('Activity: ' + activity); // Log activity data

        return (
            <section className="head-text mb-10">
                Activity
                <section className="mt-10 flex flex-col gap-5">
                    {
                        activity.length > 0 ? (
                            <>
                                {activity.map(activity => {
                                    return (
                                        <Link
                                            key={activity._id}
                                            href={`/thread/${activity.parentId}`}>
                                            <article className='activity-card'>
                                                {activity.author.image ? (
                                                    <Image
                                                        src={activity.author.image}
                                                        alt="Profile picture"
                                                        width={20}
                                                        height={20}
                                                        className="rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <p className="text-light-4 text-base-regular">No image available</p>
                                                )}

                                                <p className="!text-small-regular text-light-1">
                                                    <span className="mr-1 text-primary-500">
                                                        {activity.author.name}
                                                    </span>{" "}
                                                    replied to your thread
                                                </p>
                                            </article>

                                        </Link>
                                    );
                                })}
                            </>
                        ) : <p className="!text-base-regular text-light-3">No activity yet</p>
                    }
                </section>
            </section>
        )
    } catch (err: any) {
        console.log(`Error: ${err.message}`);
        return <p>Error loading activity</p>;
    }
}

export default Activity;
