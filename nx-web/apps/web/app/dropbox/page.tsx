"use client"
import React from "react";
import Image from "next/image";

export interface PageProps {
}

const Page = ({}: PageProps) => {
   return (
      <div>
         <Image height={100} width={100} src={`https://www.dropbox.com/scl/fi/tjoshr2f2e235q42yew5q/car.jpg?rlkey=xkhbg4tj5fwm26sql4zk5jg46&raw=1`} alt={``} />
         <Image height={200} width={200} src={`https://www.dropbox.com/scl/fi/zwmawt4bu8koec918jdne/friends.webp?rlkey=zyp0y2a1478fgiy75wlh1a9cw&raw=1`} alt={``} />
      </div>
   );
};

export default Page;
