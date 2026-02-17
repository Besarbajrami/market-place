import { ListingCard } from "../../../features/listings/ListingCard";
import {
  useApproveListing,
  useRejectListing
} from "../../../api/admin/listings/useAdminPendingListings";

interface Props {
  listing: any;
}

export function AdminPendingCard({ listing }: Props) {
  const approve = useApproveListing();
  const reject = useRejectListing();

  return (
    <ListingCard
      listing={listing}
      isAdminView
      onApprove={() => approve.mutate(listing.id)}
      onReject={() =>
        reject.mutate({ id: listing.id, reason: "Rejected by admin" })
      }
    />
  );
}
