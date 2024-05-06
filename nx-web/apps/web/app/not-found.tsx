import React from "react";

export interface NotFoundProps {
}

const NotFound = ({}: NotFoundProps) => {
   return (
      <section className="min-h-[70vh] w-full text-center flex flex-col items-center justify-center">
         <h2 className={`text-2xl font-semibold leading-tight`}>
            Oops, page not found!
         </h2>
      </section>
   );
};

export default NotFound;
