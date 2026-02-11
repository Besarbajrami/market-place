using Marketplace.Api.Common;
using Marketplace.Application.Common.Interfaces;
using Marketplace.Application.Features.Listings.Commands.AddListingImage;
using Marketplace.Application.Features.Listings.Commands.BumpListing;
using Marketplace.Application.Features.Listings.Commands.CreateListing;
using Marketplace.Application.Features.Listings.Commands.PublishListing;
using Marketplace.Application.Features.Listings.Commands.SetListingCoverImage;
using Marketplace.Application.Features.Listings.Commands.UpdateDraftListing;
using Marketplace.Application.Features.Listings.Commands.UpdateListingBasics;
using Marketplace.Application.Features.Listings.Queries.GetListingById;
using Marketplace.Application.Features.Listings.Queries.GetListingDetails;
using Marketplace.Application.Features.Listings.Queries.GetListingForEdit;
using Marketplace.Application.Features.Listings.Queries.SearchListings;
using Marketplace.Application.Features.Listings.Queries.SearchListingsV2;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System.Security.Claims;

namespace Marketplace.Api.Controllers;
[Authorize]
[Route("api/listings")]
public sealed class ListingsController : ApiControllerBase
{
    private readonly IMediator _mediator;
    private readonly ICurrentUserService _currentUser;
    private readonly IWebHostEnvironment _env;

    public ListingsController(IMediator mediator, ICurrentUserService currentUser, IWebHostEnvironment env)
    {
        _mediator = mediator;
        _currentUser = currentUser;
        _env = env;
    }


    [HttpPost("{id:guid}/bump")]
    public async Task<IActionResult> Bump(Guid id, CancellationToken ct)
    {
        var sellerId = CurrentUser.Id(User);

        var result = await _mediator.Send(new BumpListingCommand(id, sellerId), ct);
        return FromResult(result);
    }

    public sealed record SetCoverRequest(Guid ImageId);
    [HttpPost("{id:guid}/images/cover")]
    public async Task<IActionResult> SetCover(
    Guid id,
    [FromBody] SetCoverRequest request,
    CancellationToken ct)
    {
        var sellerId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new SetListingCoverImageCommand(id, sellerId, request.ImageId),
            ct);

        return FromResult(result);
    }

    public sealed record UpdateDraftListingRequest(
    Guid CategoryId,
    string Title,
    string Description,
    decimal Price,
    string CountryCode,
    string Currency,
    string City,
    string Region,
    string Condition
);
    [HttpPost("draft")]
    public async Task<IActionResult> CreateDraft(CancellationToken ct)
    {
        var sellerId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new CreateDraftListingCommand(sellerId),
            ct);

        return FromResult(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateDraft(
    Guid id,
    [FromBody] UpdateDraftListingRequest request,
    CancellationToken ct)
    {
        var sellerId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new UpdateDraftListingCommand(
                id,
                sellerId,
                request.CategoryId,
                request.Title,
                request.Description,
                request.Price,
                request.CountryCode,
                request.Currency,
                request.City,
                request.Region,
                request.Condition
            ),
            ct);

        return FromResult(result);
    }


    [AllowAnonymous]
    [HttpGet("search-v2")]
    public async Task<IActionResult> SearchV2(
    [FromQuery] string? query,
    [FromQuery] Guid? categoryId,
    [FromQuery] bool includeChildCategories = true,
    [FromQuery] string? city = null,
    [FromQuery] string? region = null,
    [FromQuery] decimal? minPrice = null,
    [FromQuery] decimal? maxPrice = null,
    [FromQuery] string? condition = null,
    [FromQuery] string sort = "newest",
    [FromQuery] int page = 1,
    [FromQuery] int pageSize = 20,
    [FromQuery] string? countryCode = null,
    CancellationToken ct = default)
    {
        var culture = RequestCultureHelper.GetCulture(HttpContext);

        Guid? viewerId = null;
        if (User?.Identity?.IsAuthenticated == true)
            viewerId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new SearchListingsV2Query(
                culture,
                viewerId, // ✅ FIXED
                query,
                categoryId,
                includeChildCategories,
                city,
                region,
                minPrice,
                maxPrice,
                condition,
                sort,
                page,
                pageSize,
                countryCode),
            ct);

        return FromResult(result);
    }


    public sealed record CreateListingRequest(
        Guid CategoryId,
        string Title,
        string Description,
        decimal Price,
        string CountryCode,
        string Currency,
        string City,
        string? Region,
        string Condition
    );
    [HttpGet("{id:guid}/edit")]
    public async Task<IActionResult> GetForEdit(Guid id, CancellationToken ct)
    {
        var sellerId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new GetListingForEditQuery(id, sellerId),
            ct);

        return FromResult(result);
    }


    // --------------------
    // GET by ID
    // --------------------
    [AllowAnonymous]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var culture = RequestCultureHelper.GetCulture(HttpContext);

        Guid? viewerId = null;
        if (User?.Identity?.IsAuthenticated == true)
            viewerId = CurrentUser.Id(User);

        var result = await _mediator.Send(new GetListingDetailsQuery(id, culture, viewerId), ct);
        return FromResult(result);
    }


    // --------------------
    // SEARCH
    // --------------------
    [HttpGet("search-basic")]
    public async Task<IActionResult> Search(
        [FromQuery] string? query,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await _mediator.Send(
            new SearchListingsQuery(query, minPrice, maxPrice, page, pageSize),
            ct);

        return FromResult(result);
    }

    // --------------------
    // CREATE
    // --------------------
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CreateListingRequest request,
        CancellationToken ct)
    {
        Console.WriteLine("=== RAW AUTH HEADER ===");
        Console.WriteLine(HttpContext.Request.Headers["Authorization"].ToString());

        Console.WriteLine("=== USER INFO ===");
        Console.WriteLine("IsAuthenticated: " + User.Identity?.IsAuthenticated);
        Console.WriteLine("AuthType: " + User.Identity?.AuthenticationType);
        Console.WriteLine("NameIdentifier: " + User.FindFirstValue(ClaimTypes.NameIdentifier));

        var sellerId = _currentUser.UserId;
        if (sellerId == null)
            return Unauthorized();

        var result = await _mediator.Send(
            new CreateListingCommand(
                sellerId.Value,
                request.CategoryId,
                request.Title,
                request.Description,
                request.Price,
                request.CountryCode,
                request.Currency,
                request.City,
                request.Region,
                request.Condition
            ),
            ct);

        if (!result.IsSuccess)
            return BadRequest(new { result.Error.Code, result.Error.Message });

        return CreatedAtAction(
            nameof(GetById),
            new { id = result.Value!.Id },
            result.Value
        );
    }
    public sealed record AddImageRequest(string Url);

    [HttpPost("{id:guid}/images")]
    public async Task<IActionResult> AddImage(
        Guid id,
        [FromBody] AddImageRequest request,
        CancellationToken ct)
    {
        var sellerId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new AddListingImageCommand(id, sellerId, request.Url),
            ct);

        return FromResult(result);
    }
    public sealed record UploadedImageDto(Guid ImageId, string Url, bool IsCover);
    [HttpPost("{id:guid}/images/upload")]
    [RequestSizeLimit(20_000_000)] // e.g. 20MB total
    public async Task<IActionResult> UploadImages(
    Guid id,
    [FromForm] IFormFileCollection files,
    CancellationToken ct)
    {
        var sellerId = CurrentUser.Id(User);

        if (files.Count == 0)
            return BadRequest(new { Code = "Images.Empty", Message = "No files uploaded." });

        // Basic server-side validation (per request). Domain will still enforce total max.
        if (files.Count > 10)
            return BadRequest(new { Code = "Listing.TooManyImages", Message = "Max 10 images per upload." });

        // Where to save: wwwroot/uploads/listings/{id}
        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var listingFolder = Path.Combine(webRoot, "uploads", "listings", id.ToString());

        Directory.CreateDirectory(listingFolder);

        var uploaded = new List<UploadedImageDto>();

        foreach (var file in files)
        {
            if (file.Length <= 0)
                continue;

            var ext = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(ext))
                ext = ".jpg"; // fallback

            var fileName = $"{Guid.NewGuid():N}{ext}";
            var filePath = Path.Combine(listingFolder, fileName);

            // Save file to disk
            await using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream, ct);
            }

            // URL seen by React (relative to site root)
            var url = $"/uploads/listings/{id}/{fileName}";

            // Use existing AddListingImageCommand (domain handles max images etc.)
            var cmdResult = await _mediator.Send(
                new AddListingImageCommand(id, sellerId, url),
                ct);

            if (!cmdResult.IsSuccess)
            {
                // propagate domain error (e.g. Listing.TooManyImages)
                return FromResult(cmdResult);
            }

            // Assuming AddListingImageResponse is something like:
            // record AddListingImageResponse(Guid ImageId, string Url, bool IsCover);
       uploaded.Add(new UploadedImageDto(
    cmdResult.Value!.ImageId,
    url,
     cmdResult.Value!.IsCover
));

        }

        return Ok(uploaded);
    }


    [HttpPut("{id:guid}/basics")]
    public async Task<IActionResult> UpdateBasics(
        Guid id,
        [FromBody] UpdateListingBasicsCommand command,
        CancellationToken ct)
    {
        if (id != command.ListingId)
            return BadRequest("Route id and body id mismatch.");

        var result = await _mediator.Send(command, ct);
        return FromResult(result);
    }

    [HttpPost("{id:guid}/publish")]
    public async Task<IActionResult> Publish(Guid id, CancellationToken ct)
    {
        var sellerId = CurrentUser.Id(User);

        var result = await _mediator.Send(
            new PublishListingCommand(id, sellerId),
            ct);

        return FromResult(result);
    }

}
