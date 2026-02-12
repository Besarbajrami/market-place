# =========================
# Build stage
# =========================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy NuGet config
COPY NuGet.Config ./

# Copy solution
COPY Marketplace.sln ./

# Copy csproj files
COPY src/Marketplace.Api/Marketplace.Api.csproj src/Marketplace.Api/
COPY src/Marketplace.Application/Marketplace.Application.csproj src/Marketplace.Application/
COPY src/Marketplace.Domain/Marketplace.Domain.csproj src/Marketplace.Domain/
COPY src/Marketplace.Infrastructure/Marketplace.Infrastructure.csproj src/Marketplace.Infrastructure/

# Restore
RUN dotnet restore Marketplace.sln --disable-parallel

# Copy source
COPY src/ src/

# ✅ Publish WITHOUT --no-restore
RUN dotnet publish src/Marketplace.Api/Marketplace.Api.csproj \
    -c Release \
    -o /app/publish

# =========================
# Runtime stage
# =========================
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Marketplace.Api.dll"]
