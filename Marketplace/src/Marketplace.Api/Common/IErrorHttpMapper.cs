namespace Marketplace.Api.Common;

public interface IErrorHttpMapper
{
    int MapStatusCode(string errorCode);
}
