import TokenDetailPage from "./TokenDetailPage";

export default async function Page({
  params,
}: {
  params: Promise<{ tokenId: string }>;
}) {
  const { tokenId } = await params;
  return <TokenDetailPage tokenId={tokenId} />;
}
