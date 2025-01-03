export default function Page({
  searchParams: { checkout_id },
}: {
  searchParams: {
    checkout_id: string;
  };
}) {
  return <div>Thank you! Your checkout is now being processed.</div>;
}
