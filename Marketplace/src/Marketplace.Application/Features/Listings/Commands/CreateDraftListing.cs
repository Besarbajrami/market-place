using MediatR;
using Marketplace.Application.Common.Results;

public sealed record CreateDraftListingCommand(Guid SellerId)
    : IRequest<Result<CreateDraftListingResponse>>;

public sealed record CreateDraftListingResponse(Guid Id);
