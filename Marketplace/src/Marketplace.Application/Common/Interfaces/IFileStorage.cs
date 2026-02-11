namespace Marketplace.Application.Common.Interfaces;

public interface IFileStorage
{
    Task<FileSaveResult> SaveAsync(
        FileSaveRequest request,
        CancellationToken ct = default);

    Task DeleteAsync(string storageKey, CancellationToken ct = default);
}

public sealed record FileSaveRequest(
    string Folder,           // e.g. "listings/{listingId}"
    string FileName,         // e.g. "abc.jpg"
    string ContentType,      // e.g. "image/jpeg"
    Stream Content
);

public sealed record FileSaveResult(
    string StorageKey,       // e.g. "listings/{listingId}/abc.jpg" (what you store in DB)
    string PublicUrl         // e.g. "/uploads/listings/{listingId}/abc.jpg" (what client can load)
);
