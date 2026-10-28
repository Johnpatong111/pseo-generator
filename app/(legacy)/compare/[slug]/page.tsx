import { redirect } from "next/navigation";

export default async function LegacyComparisonRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/pl/compare/${slug}`);
}
