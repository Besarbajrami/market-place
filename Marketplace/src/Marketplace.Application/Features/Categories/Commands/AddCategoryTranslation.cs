using Marketplace.Application.Common.Results;
using MediatR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Marketplace.Application.Features.Categories.Commands
{
    public sealed record AddCategoryTranslationCommand(
     Guid CategoryId,
     string Culture,
     string Name,
     string Slug
 ) : IRequest<Result>;

}
