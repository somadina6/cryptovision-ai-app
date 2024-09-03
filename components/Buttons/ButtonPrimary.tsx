import Link from "next/link";
import React, { FC } from "react";

type Props = {
  text: string;
  href?: string;
};
const ButtonPrimary: FC<Props> = ({ text, href }) => {
  return (
    <button className="border-2 py-2 px-3 flex items-center justify-center border-primary rounded-md text-primary">
      {href ? <Link href={href}>{text}</Link> : text}
    </button>
  );
};

export default ButtonPrimary;
