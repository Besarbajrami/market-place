using Marketplace.Application.Common.Interfaces;

namespace Marketplace.Infrastructure.Storage;

public sealed class LocalFileStorage : IFileStorage
{
    private readonly string _webRootPath;
    private readonly string _publicBasePath; // e.g. "/uploads"

    public LocalFileStorage(string webRootPath, string publicBasePath = "/uploads")
    {
        _webRootPath = webRootPath;
        _publicBasePath = publicBasePath.TrimEnd('/');
    }

    public async Task<FileSaveResult> SaveAsync(FileSaveRequest request, CancellationToken ct = default)
    {
        // Store inside wwwroot/uploads/{Folder}/{FileName}
        var relativeFolder = Path.Combine("uploads", request.Folder.Replace("/", Path.DirectorySeparatorChar.ToString()));
        var absoluteFolder = Path.Combine(_webRootPath, relativeFolder);

        Directory.CreateDirectory(absoluteFolder);

        var safeFileName = request.FileName;
        var absolutePath = Path.Combine(absoluteFolder, safeFileName);

        await using var fileStream = File.Create(absolutePath);
        await request.Content.CopyToAsync(fileStream, ct);

        var storageKey = $"{request.Folder.TrimEnd('/')}/{safeFileName}";
        var publicUrl = $"{_publicBasePath}/{request.Folder.TrimEnd('/')}/{safeFileName}".Replace("\\", "/");

        return new FileSaveResult(storageKey, publicUrl);
    }

    public Task DeleteAsync(string storageKey, CancellationToken ct = default)
    {
        // storageKey like "listings/{id}/abc.jpg"
        var absolutePath = Path.Combine(_webRootPath, "uploads", storageKey.Replace("/", Path.DirectorySeparatorChar.ToString()));

        if (File.Exists(absolutePath))
            File.Delete(absolutePath);

        return Task.CompletedTask;
    }
}
