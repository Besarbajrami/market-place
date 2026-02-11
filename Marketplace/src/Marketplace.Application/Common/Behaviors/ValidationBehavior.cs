using FluentValidation;
using MediatR;
using Marketplace.Application.Common.Results;
using Marketplace.Application.Common.Errors;

namespace Marketplace.Application.Common.Behaviors;

public sealed class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
            return await next();

        var context = new ValidationContext<TRequest>(request);
        var results = await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));
        var failures = results.SelectMany(r => r.Errors).Where(f => f is not null).ToList();

        if (failures.Count == 0)
            return await next();

        // If you use Result<T> everywhere, return a Result failure.
        // This expects your response type is Result<something>.
        var first = failures[0];

        object failureResult = typeof(TResponse).IsGenericType &&
                               typeof(TResponse).GetGenericTypeDefinition() == typeof(Result<>)
            ? CreateResultFailure<TResponse>(first.ErrorMessage)
            : throw new ValidationException(failures);

        return (TResponse)failureResult;
    }

    private static T CreateResultFailure<T>(string message)
    {
        // Result<TValue>.Failure(Error)
        var responseType = typeof(T);
        var valueType = responseType.GetGenericArguments()[0];

        var resultType = typeof(Result<>).MakeGenericType(valueType);
        var failureMethod = resultType.GetMethod("Failure", new[] { typeof(Error) })!;

        var error = new Error("Validation.Failed", message);
        return (T)failureMethod.Invoke(null, new object[] { error })!;
    }
}
