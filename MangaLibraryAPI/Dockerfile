# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy csproj and restore (layer caching)
COPY *.sln ./
COPY MangaLibrary.Api/*.csproj ./MangaLibrary.Api/
RUN dotnet restore

# Copy everything else and build
COPY . .
RUN dotnet publish MangaLibrary.Api -c Release -o /out

# Stage 2: Runtime (smaller image)
FROM mcr.microsoft.com/dotnet/aspnet:9.0

WORKDIR /app

COPY --from=builder /out .

EXPOSE 8080

ENTRYPOINT ["dotnet", "MangaLibrary.Api.dll"]