import SearchBar from "../SearchBar/SearchBar";
import { ProfileDropdown } from "./Profilev2";

const Header = () => {
  return (
    <section id="header">
      <div className="flex items-center justify-center w-full max-w-screen-xl mx-auto relative ">
        <div className="mt-1">
          <SearchBar />
        </div>

        <div className="absolute right-0 top-1">
          <ProfileDropdown />
        </div>
      </div>
    </section>
  );
};

export default Header;
