namespace Marketplace.Domain.Enums;

public enum ModerationStatus
{
    Pending = 1,   // waiting admin review
    Approved = 2,  // visible publicly
    Rejected = 3,  // rejected by admin
    Hidden = 4,     // hidden later (reports, abuse)
        UnderReview = 5

}

