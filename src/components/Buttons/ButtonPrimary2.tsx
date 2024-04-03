import Link from "next/link";
import React, { FC } from "react";

type Props = {
  text: string;
  href?: string;
};
const ButtonPrimary2: FC<Props> = ({ text, href }) => {
  return (
    <button className="py-2 px-3 flex items-center justify-center bg-primary rounded-md text-[#fff] hover:opacity-95 border-2 border-primary">
      {href ? <Link href={href}>{text}</Link> : text}
    </button>
  );
};

export default ButtonPrimary2;
