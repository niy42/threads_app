import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/shared/ProfileHeader";

import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab"; // Ensure the correct import
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";

const Page = async function () {

    try {
        // fetch communities
        const { communities } = await fetchCommunities({
            searchString: "",
            pageNumber: 1,
            pageSize: 25
        });
        console.log('result: ', communities);

        return (
            <section className="head-text mb-10">
                Community
                {/*Community*/}

                <div className='mt-14 flex flex-col gap-9'>
                    {communities.length === 0 ? (
                        <p className="no-result">No users</p>
                    ) : (
                        <>
                            {communities.map((community) => {
                                return (
                                    < CommunityCard
                                        key={community._id}
                                        id={community._id}
                                        name={community.name}
                                        username={community.username}
                                        imgUrl={community.image}
                                        bio={community.bio}
                                        members={community.members} />
                                )
                            })}
                        </>
                    )}
                </div>
            </section>


        )
    } catch (error: any) {
        console.error(`Error: ${error}`)
    }
}

export default Page;
