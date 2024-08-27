"use client";
import { MutatingDots } from "react-loader-spinner";
import Balance from "../../../../components/Balance/Balance";
import Table from "../../../../components/Table/Table";
import { useAppSelector } from "../../../../store/hooks";

const Page = () => {
  // const { status } = useSession();

  const userId = useAppSelector((state) => state.user.userId);
  const status = useAppSelector((state) => state.user.status);

  if (status === "loading") {
    return (
      <div className="flex gap-2">
        <MutatingDots height="100" width="100" />
        <p>{status}...</p>
      </div>
    );
  }

  if (userId) {
    return (
      <div className="w-full ">
        <section className="flex flex-col-reverse md:grid md:grid-cols-[1fr_200px] gap-4 ">
          <div id="first-col" className="block overflow-x-auto">
            <Table userId={userId} />
          </div>
        </section>
      </div>
    );
  }

  // Handle other states or unauthenticated status

  return (
    <div>
      <p>You are not authenticated</p>
    </div>
  );
};

export default Page;
