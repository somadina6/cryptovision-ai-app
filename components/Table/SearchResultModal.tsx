import { FC, useState } from "react";
import Image from "next/image";
import { TokenData } from "../../types/types";
import { IoIosCloseCircleOutline } from "react-icons/io";
import axios from "axios";
import { RiArrowGoBackFill } from "react-icons/ri";
import Backdrop from "../Backdrop/Backdrop";
import { MutatingDots } from "react-loader-spinner";
import { CoingeckoResult } from "../../types/types";
import { coingeckoAxios } from "../../utils/axios/axios";

type Props = {
  search: CoingeckoResult[] | undefined;
  setTokenToAddDetails: React.Dispatch<React.SetStateAction<TokenData>>;
  tokenToAddDetails: TokenData;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  searchLoading: boolean;
};

const itemsPerPage = 8; // Number of items to display per page

const SearchResultModal: FC<Props> = ({
  search,
  setTokenToAddDetails,
  tokenToAddDetails,
  showModal,
  setShowModal,
  searchLoading,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [tokenDetailFromAPI, setTokenDetailFromAPI] =
    useState<CoingeckoResult>();

  // Calculate total number of pages
  const totalPages = Math.ceil((search?.length || 0) / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = search?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const getTokenDetailsFromAPI = async (coinId: string) => {
    setIsTokenLoading(true);
    setShowTokenModal(true);
    try {
      const { data } = await coingeckoAxios.get("coins/markets", {
        params: {
          vs_currency: "usd",
          ids: coinId,
        },
      });

      setTokenDetailFromAPI(data[0]);

      return data;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to Get Token Details");
    } finally {
      setIsTokenLoading(false);
    }
  };

  return (
    <div className="mx-auto my-auto w-[600px] z-20">
      {searchLoading && (
        <div className="absolute top-1/3 left-1/3">
          <MutatingDots height="100" width="100" />
        </div>
      )}
      {/* Modal  */}
      {showModal && !searchLoading && (
        <div className=" mx-auto w-full border px-4 rounded-lg h-[400px] bg-white dark:bg-black ">
          <section className="w-full h-full">
            <div className="h-[12%] w-full flex items-center justify-between">
              <div className="flex-grow text-center">
                <h3 className="text-primary text-2xl font-medium ">
                  Search Results
                </h3>
              </div>
              <IoIosCloseCircleOutline
                size={24}
                color="red"
                className="cursor-pointer"
                onClick={() => {
                  setShowModal(false);
                  setCurrentPage(1);
                  setTokenDetailFromAPI(undefined);
                  setShowTokenModal(false);
                }}
              />
            </div>

            {/* List of Search Result Table */}
            {!showTokenModal && (
              <>
                <section className="h-4/6 overflow-y-scroll">
                  <table className="w-full ">
                    <thead>
                      <tr className="border-b text-primary">
                        <th className="px-5 text-left w-3/5 ">Name</th>
                        <th className="px-5 text-left">Symbol</th>
                      </tr>
                    </thead>

                    <tbody className="font-normal font-sans">
                      {currentItems.map((coin) => (
                        <tr
                          key={coin.id}
                          className="cursor-pointer hover:bg-gray-600 hover:text-primary"
                          onClick={() => {
                            getTokenDetailsFromAPI(coin.id);
                          }}
                        >
                          <td className="flex gap-2 px-5 overflow-scroll">
                            {coin.name}
                          </td>
                          <td className="uppercase px-5">{coin.symbol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
                {/* Pagination controls */}
                <div className="pagination w-full flex justify-between items-end h-1/6 ">
                  <button
                    onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </>
            )}
            {showTokenModal && tokenDetailFromAPI && (
              <div className="flex flex-col gap-5 justify-between h-5/6 pt-2">
                <div className="  flex items-center justify-between">
                  <div className="px-1 z-10 w-4/5 dark:text-white">
                    <h2 className="text-xl font-semibold">
                      {tokenDetailFromAPI.name}{" "}
                      <span className="uppercase">
                        ({tokenDetailFromAPI.symbol})
                      </span>
                    </h2>
                    <Image
                      src={tokenDetailFromAPI.image}
                      alt={tokenDetailFromAPI.name}
                      className="w-24 h-24 my-4"
                      height={96}
                      width={96}
                    />
                    <p>Current Price: {tokenDetailFromAPI.current_price}</p>
                    <p>
                      24HR Change:{" "}
                      {tokenDetailFromAPI.price_change_percentage_24h}
                    </p>
                    <p>ATH: ${tokenDetailFromAPI.ath}</p>
                    <p>Market Cap Rank: {tokenDetailFromAPI.market_cap_rank}</p>

                    {/* Add more token information here */}
                  </div>
                  <div
                    className="uppercase cursor-pointer hover:text-primary"
                    onClick={() => {
                      setTokenToAddDetails({
                        ...tokenToAddDetails,
                        name: tokenDetailFromAPI.name,
                        price: tokenDetailFromAPI.current_price,
                        symbol: tokenDetailFromAPI.symbol,
                        image: tokenDetailFromAPI.image,
                        coinId: tokenDetailFromAPI.id,
                        price_change_percentage_24h:
                          tokenDetailFromAPI.price_change_percentage_24h,
                      });
                      setShowModal(false);
                      setCurrentPage(1);
                      setShowTokenModal(false);
                    }}
                  >
                    Add to table
                  </div>
                </div>

                <button
                  onClick={() => setShowTokenModal(false)}
                  className="flex gap-2 items-center justify-center hover:text-primary"
                >
                  <RiArrowGoBackFill />
                  <p>Go back to search results</p>
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default SearchResultModal;
