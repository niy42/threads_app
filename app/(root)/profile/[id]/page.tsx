import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.action";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab"; // Ensure the correct import

const Page = async function ({ params }: { params: { id: string } }) {

    try {
        const user = await currentUser();
        console.log(user);

        if (!user) return null;

        const userInfo = await fetchUser(params.id);

        if (!userInfo?.onboarded) {
            redirect('/onboarding');
            return null; // Ensure the function exits after redirecting
        }

        return (
            <section>
                <ProfileHeader
                    accountId={userInfo.id}
                    authUserId={user.id}
                    name={userInfo.name}
                    username={userInfo.username}
                    imgUrl={userInfo.image}
                    bio={userInfo.bio}
                />

                <div className='mt-9'>
                    <Tabs defaultValue="threads" className="w-full">
                        <TabsList className="tab">
                            {profileTabs.map((tab) => (
                                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                                    <Image
                                        src={tab.icon}
                                        alt={tab.label}
                                        width={24}
                                        height={24}
                                        className='object-contain'
                                    />
                                    <p className='max-sm:hidden'>{tab.label}</p>
                                    {tab.label === 'Threads' && <p className="ml-1 rounded-sm !text-tiny-medium bg-light-4 px-2 py-1 text-light-2">{userInfo?.threads.length}</p>}
                                </TabsTrigger>))}
                        </TabsList>
                        {profileTabs.map((tab) => (
                            <TabsContent key={`content-${tab.label}`} value={tab.value} className='w-full text-light-1'>
                                <ThreadsTab
                                    currentUserId={user.id}
                                    accountId={userInfo.id}
                                    accountType='User'
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </section>
        );
    } catch (error) {
        console.error("Error loading page:", error);
        return <div>Error loading page</div>;
    }
}

export default Page;
