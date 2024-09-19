import Balance from "../Cards/Balance";

const RightSection = () => {
  return (
    <section
      className="hidden md:block md:fixed top-16 right-0 w-[220px] md:min-h-screen 
    overflow-y-hidden pl-0 pr-6 md:py-6 "
    >
      <Balance />
    </section>
  );
};

export default RightSection;
