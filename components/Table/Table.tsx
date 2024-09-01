"use client";
import "./styles.css";
import { deleteToken, formatPrice } from "../../utils/apis/apis";
import { FC, useEffect } from "react";
import toast from "react-hot-toast";
import { CiTrash } from "react-icons/ci";
import { mutate } from "swr";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import LoadUserData from "../LoadUserData/LoadUserData";
import useTokens from "@/lib/useTokens";
import { setUserTokens } from "@/store/features/tokenSlice";

const Table: FC<{ userId: string }> = ({ userId }) => {
  const dispatch = useAppDispatch();

  const { tokens: coinDetails, isLoading } = useTokens(userId);

  useEffect(() => {
    if (coinDetails) dispatch(setUserTokens(coinDetails));
  }, [coinDetails]);

  const removeUserToken = async (id: string) => {
    const loadingId = toast.loading("Deleting Token");

    try {
      const res = await deleteToken(userId, id);
      if (res.success === true) {
        toast.success(res.message, { id: loadingId });
        await mutate(`${userId}`);
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete", { id: loadingId });
    } finally {
      toast.dismiss(loadingId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center max-w-[600px] p-4 mx-auto my-8 bg-popover-background rounded-lg ">
        <h2 className="text-xl font-semibold ">Loading...</h2>
      </div>
    );
  }

  if (coinDetails && coinDetails.length === 0)
    return (
      <div className="flex flex-col items-center max-w-[600px] p-4 mx-auto my-8 bg-popover-background rounded-lg ">
        <h2 className="text-xl font-semibold ">
          Looks like you don't have any tokens tracked
        </h2>
      </div>
    );

  return (
    <div className="max-w-[380px] md:max-w-full rounded-lg">
      <p className="text-sm text-gray-700 dark:text-white mb-2">
        This page displays a table of your tokens, including their name, symbol,
        real-time price, and amount.
      </p>

      <table className="md:w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-black dark:text-primary uppercase border-b border-gray-600 w-full ">
          <tr className="">
            <th className="px-6 py-3 w-5/12">Coin</th>
            <th className="px-6 py-3">Symbol</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">24HR</th>
            <th className="px-6 py-3">Amount</th>
            <th className="px-6 py-3">Total</th>

            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>

        <tbody className="text-sm text-black dark:text-white uppercase">
          {coinDetails &&
            coinDetails.map(({ token, amount, _id }) => (
              <tr
                key={_id.toString()}
                className="border-b hover:bg-gray-50 dark:hover:text-primary  dark:hover:bg-gray-950 h-10 overflow-clip"
              >
                <th className="px-6 py-4 flex gap-2 items-center">
                  <p className="">{token.name}</p>
                  <span>
                    {token.image && (
                      <Image
                        src={token.image}
                        alt={token.name}
                        width={20}
                        height={20}
                      />
                    )}
                  </span>
                </th>
                <td className="px-6 py-4">{token.symbol}</td>
                <td className="px-6 py-4">${token.current_price}</td>
                {token.price_change_percentage_24h ? (
                  <td
                    className={`px-6 py-4 ${
                      token.price_change_percentage_24h < 0
                        ? "text-red-600"
                        : "text-green-500"
                    }`}
                  >
                    {token.price_change_percentage_24h > 0 ? "+" : ""}
                    {token.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                ) : (
                  <td></td>
                )}

                <td className="px-6 py-4">{amount}</td>
                <td className="px-6 py-4">
                  {formatPrice(amount * token.current_price, "USD")}
                </td>
                <td
                  className="px-6  hover:text-red-500 "
                  onClick={() => removeUserToken(token._id.toString())}
                >
                  <CiTrash
                    size={17}
                    color="red"
                    className="hover:font-bold cursor-pointer "
                  />
                </td>
              </tr>
            ))}

          {/* SEARCH ROW BEGIN*/}

          {/* END OF TABLE  */}
        </tbody>
      </table>
      {/* {showSearch && (
        <Backdrop isOpen={showSearch}>
          <SearchResultModal
            search={searchResults}
            tokenToAddDetails={tokenToAddDetails}
            setTokenToAddDetails={setTokenToAddDetails}
            showModal={showSearch}
            setShowModal={setShowSearch}
            searchLoading={searchLoading}
          />
        </Backdrop>
      )} */}
    </div>
  );
};

export default Table;
