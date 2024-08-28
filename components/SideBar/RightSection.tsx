import Balance from "../Balance/Balance";

const RightSection = () => {
  return (
    <section className="fixed top-16 right-0 w-56 min-h-screen overflow-y-scroll md:px-2 md:py-6">
      <Balance />
    </section>
  );
};

export default RightSection;
