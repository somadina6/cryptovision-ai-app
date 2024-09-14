import SearchBar from "../SearchBar/SearchBar";
import { ProfileDropdown } from "./Profilev2";

const Header = () => {
  return (
    <section id="header">
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        <div className="flex-1 flex justify-center">
          <div className="md:w-[600px] w-full">
            <SearchBar />
          </div>
        </div>

        <ProfileDropdown />
      </div>
    </section>
  );
};

export default Header;
