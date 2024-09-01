import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
  return (
    <section className="h-16 w-full flex px-4 md:px-12 py-4 items-center justify-center sticky top-0 z-10 bg-background ">
      <div className="md:w-[600px]">
        <SearchBar />
      </div>
    </section>
  );
};

export default Header;
