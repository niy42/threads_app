import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/ProfileHeader";

import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab"; // Ensure the correct import
import UserCard from "@/components/cards/UserCard";

const Page = async function () {

    try {
        const user = await currentUser();
        console.log(user);

        if (!user) return null;

        const userInfo = await fetchUser(user.id);

        if (!userInfo?.onboarded) {
            redirect('/onboarding');
            return null; // Ensure the function exits after redirecting
        }

        // fetch users
        const { users } = await fetchUsers({
            userId: user.id,
            searchString: "",
            pageNumber: 1,
            pageSize: 25
        });
        console.log('result: ', users);

        return (
            <section className="head-text mb-10">
                Search
                {/* Searchbar */}

                <div className='mt-14 flex flex-col gap-9'>
                    {users.length === 0 ? (
                        <p className="no-result">No users</p>
                    ) : (
                        <>
                            {users.map((person) => {
                                return (
                                    < UserCard
                                        key={person.id}
                                        id={person.id}
                                        name={person.name}
                                        username={person.username}
                                        imgUrl={person.image}
                                        personType="User" />)
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
