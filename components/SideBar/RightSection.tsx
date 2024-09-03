import Balance from "../Balance/Balance";

const RightSection = () => {
  return (
    <section className="fixed top-16 right-0 w-[220px] min-h-screen overflow-y-hidden pl-0 pr-6 md:py-6 ">
      <Balance />
    </section>
  );
};

export default RightSection;
