namespace Marketplace.Api.Common;

public interface IErrorLocalizer
{
    string Localize(string errorCode, string? fallbackMessage = null);
}
