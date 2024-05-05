"use client";
import React, { useMemo, useState } from "react";
import { Profile, User } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@components/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/button";
import { MessagesSquare, UserRoundCheck, UserRoundPlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@components/tooltip";
import { useSession } from "next-auth/react";
import { usePromise } from "@web/hooks/usePromise";
import { ModalType, useModals } from "@web/providers/ModalsProvider";
import { handleFollowUser, handleUnfollowUser } from "@web/app/users/[userId]/actions";
import { cn, getFileName } from "@utils";
import MessageUserModal from "@web/app/users/search/_components/MessageUserModal";

export interface UserCardProps {
   user: User & {
      profile: Profile, images: ({ _count: { downloads: number, likes: number } })[],
      _count: {
         images: number
         imageComments: number,
         imageLikes: number,
      },
      following: { followerId: string }[],
   };
}

const UserCard = ({ user }: UserCardProps) => {
   const session = useSession();
   const [messageUserModalOpen, setMessageUserModalOpen] = useState(false);

   const amIFollower = useMemo(() => {
      return user.following.some(f => f.followerId === session?.data?.user?.id);
   }, []);

   const { openModal } = useModals();

   const { loading, action: followUser } = usePromise(async () => {
      if (!session.data) {
         openModal(ModalType.SIGN_IN);
         return;
      }
      if (amIFollower) {
         await handleUnfollowUser(user.id).then(console.log).catch(console.error);
      } else {
         await handleFollowUser(user.id).then(console.log).catch(console.error);
      }
   });

   return (
      <div>
         <MessageUserModal
            open={messageUserModalOpen}
            onOpenChange={setMessageUserModalOpen}
            user={user} />
         <Link href={`/users/${user.id}`}>
            <Card className={`hover:shadow-lg cursor-pointer`}>
               <CardHeader className={`!p-3`}>
                  <CardTitle>
                     <div style={
                        {
                           background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))`,
                           backgroundImage: !!user.profile.cover_image?.length ? `url('/covers/${getFileName(user.profile.cover_image)}')` : ``,
                           backgroundPosition: `center center`,
                           backgroundSize: `cover`,
                        }
                     } className={`w-full h-[70px] bg-black rounded-lg`}></div>
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className={`flex items-center w-full gap-2`}>
                     <Image className={`rounded-full shadow-md`} height={40} width={40} src={user.image}
                            alt={user.name} />
                     <div className={`flex flex-col items-start justify-center gap-1`}>
                        <span className={`text-sm`}>{user.name}</span>
                        <span className={`text-xs text-neutral-500`}>
                        {user.images.length} uploads
                     </span>
                     </div>
                     <div className={`!justify-self-end flex-1 flex justify-end !items-end gap-1`}>
                        <Button
                           onClick={e => {
                              setMessageUserModalOpen(true);
                              e.preventDefault();
                              e.stopPropagation();
                           }}
                           className={`rounded-full`}
                           variant={`ghost`} size={"icon"}>
                           <TooltipProvider>
                              <Tooltip delayDuration={50}>
                                 <TooltipTrigger>
                                    <Button
                                       onClick={e => {
                                          e.preventDefault();
                                       }}
                                       className={`rounded-full border-[0px] border-neutral-300 !p-3 !h-fit`}
                                       variant={`ghost`}
                                    >
                                       <MessagesSquare size={16} />
                                    </Button>
                                 </TooltipTrigger>
                                 <TooltipContent
                                    side={`bottom`}
                                    className={`dark:bg-white dark:text-black bg-black !text-xs`}>
                                    Message
                                 </TooltipContent>
                              </Tooltip>
                           </TooltipProvider>
                        </Button>
                        <Button
                           disabled={loading}
                           onClick={async e => {
                              e.preventDefault();
                              await followUser();
                           }} className={`rounded-full`} variant={`ghost`} size={"icon"}>
                           <TooltipProvider>
                              <Tooltip delayDuration={50}>
                                 <TooltipTrigger>
                                    <Button
                                       className={cn(`rounded-full border-[0px] border-neutral-300 !p-3 !h-fit`,
                                          amIFollower && `!bg-neutral-200 hover:!bg-neutral-200`,
                                       )}
                                       variant={`ghost`}
                                    >
                                       {amIFollower ? (
                                          <UserRoundCheck className={`text-green-600 `} size={16} />
                                       ) : (
                                          <UserRoundPlus size={16} />
                                       )}
                                    </Button>
                                 </TooltipTrigger>
                                 <TooltipContent
                                    side={`bottom`}
                                    className={`dark:bg-white dark:text-black bg-black !text-xs`}>
                                    {amIFollower ? (
                                       `Unfollow`
                                    ) : (
                                       `Follow`
                                    )}
                                 </TooltipContent>
                              </Tooltip>
                           </TooltipProvider>
                        </Button>
                     </div>
                  </div>
               </CardContent>
               <CardFooter className={`!mt-2 !pb-2`}>
                  <div className={`flex items-center gap-2`}>
                     <div>
                    <span className={`font-semibold text-xs mr-1 text-neutral-500`}>
                       {user.images.reduce((acc, curr) =>
                          acc + curr._count.downloads, 0)}
                    </span>
                        <span className={`font-normal text-xs text-neutral-500`}>
                          Downloads
                    </span>
                     </div>
                     &bull;
                     <div>
                    <span className={`font-semibold text-xs mr-1 text-neutral-500`}>
                       {user.images.reduce((acc, curr) =>
                          acc + curr._count.likes, 0)}
                    </span>
                        <span className={`font-normal text-xs text-neutral-500`}>
                          Likes
                    </span>
                     </div>
                  </div>
               </CardFooter>
            </Card>
         </Link>
      </div>
   );
};

export default UserCard;
