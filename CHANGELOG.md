# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   angular: TS-8897 :: Feature :: Deprecate `createAngularProviders` in favor of `angularProvidersBuilder` ([#139])
    -   `angularProvidersBuilder` added. The old method failed on production builds as it used strings to derive the method name.
    -   Usage:
        -   1: Create the builder, pass the Angular provider for the pure TS Harmony provider
        -   2: In short form, set the class to provide and how to retrieve it from the provider
        -   3: If custom deps are needed, pass an array as third parameter. Note that the Harmony provider must go in the first position
        -   4: Build the Angular providers array.
        ```ts
        @NgModule({
            // 1.
            providers: angularProvidersBuilder({
                provide: ExampleProvider,
                useFactory: () => new ExampleDefaultProvider(),
            })
                // 2.
                .add(GetCountriesInteractor, (p) => p.provideGetCountries())
                // 3.
                .add(PutCountryInteractor, (p, common) => p.providePutCountry(common.provideStorage()), [
                    ExampleProvider,
                    CommonProvider,
                ])
                // 4.
                .build(),
        })
        export class ExampleProviderModule {}
        ```

### Changed

-   …

### Deprecated

-   angular: TS-8897 :: Feature :: Deprecate `createAngularProviders` in favor of `angularProvidersBuilder` ([#139])
    -   `createAngularProviders` is removed in favor of `angularProvidersBuilder`, see **Added** section.

### Removed

-   …

### Fixed

-   …

### Security

-   …

[#139]: https://github.com/mobilejazz/harmony-typescript/pull/139

## [1.0.0]

### Added

-   core: FRONTEND-4243 :: Feature :: Harmony-typescript `NetworkDataSource` ([#131])

### Changed

-   …

### Deprecated

-   …

### Removed

-   …

### Fixed

-   bugfender: FRONTEND-7941 :: Bug :: Remove `@bugfender/common` requirement ([#135])
-   all: FRONTEND-8163 :: Bug :: Fix invalid `main` field error ([#136])
-   core: FRONTEND-9706 :: Feature :: Allow void as a return type for NetworkDataSource ([#141])

### Security

-   …

[#131]: https://github.com/mobilejazz/harmony-typescript/pull/131
[#135]: https://github.com/mobilejazz/harmony-typescript/pull/135
[#136]: https://github.com/mobilejazz/harmony-typescript/pull/136
[#141]: https://github.com/mobilejazz/harmony-typescript/pull/141

## [0.12.0] - 2023-01-19

### Added

-   core: FRONTEND-8367 :: Feature Internal :: Add a Changelog ([#132])
-   core: FRONTEND-8139 :: Feature Internal :: Tweak log tags rendering ([#128])

### Changed

-   core: FRONTEND-3555 :: Feature :: Merge Logger & AbstractLogger and improve API ([#124]).
-   core: FRONTEND-1702 :: Feature Internal :: Tweak tooling configuration ([#118]).
-   core: FRONTEND-7708 :: Feature Internal :: Remove createCacheDecorator in favor of self contained `Cached` decorator ([#127]).
-   core: FRONTEND-3575 :: Feature Internal :: Refactor InMemoryDataSource to use `Map` ([#129])

### Deprecated

-   core: BACKEND-3553 :: Feature :: Harmony TS | Queries deprecation ([#121]).

[#118]: https://github.com/mobilejazz/harmony-typescript/pull/118
[#121]: https://github.com/mobilejazz/harmony-typescript/pull/121
[#124]: https://github.com/mobilejazz/harmony-typescript/pull/124
[#127]: https://github.com/mobilejazz/harmony-typescript/pull/127
[#128]: https://github.com/mobilejazz/harmony-typescript/pull/128
[#129]: https://github.com/mobilejazz/harmony-typescript/pull/129
[#132]: https://github.com/mobilejazz/harmony-typescript/pull/132

## [0.11.0-0.11.2] - 2022-12-02

### Added

-   examples: BACKEND-1431 :: Feature Internal :: Harmony TS | Add `API.http` documentation for backend example ([#112]).
-   examples: FRONTEND-5167 :: Feature Internal :: Refactor Angular sample to use view-states ([#115]).
-   FRONTEND-2716 :: Feature Internal :: Add owners to Harmony-TS - Github ([#117]).
-   angular: FRONTEND-1215 :: Feature :: Add createAngularProviders in a similarway to `createNestProviders` ([#119]).

### Changed

-   core: Remove optionals (`?`) from SQL query signatures ([#72]).
-   core: Improve StorageDataSource ([#73]).
-   core: Fix "put" pipeline signatures ([#75]).
-   core: Enable strict mode ([#76]).
-   core: Repurpose `Repository` & `DataSource` to express the combination of get/put/delete types ([#108]).
-   core: BACKEND-1429 :: Feature-Internal :: Use abstract classes for SQLInterface & SQLDialect (for DI) ([#111]).
-   core: FRONTEND-1411 :: Feature Internal :: Change harmony-core `class-transformer` dependency into a `peerDependency` ([#114]).

### Deprecated

-   core: ALL-8972 :: Feature :: Delete/deprecate getAll and putAll from Harmony ([#97]).

### Removed

-   core: Deprecated `deleteAll` removed ([#69]).

### Fixed

-   core: FRONTEND-3512 :: Bug :: Relax `Type<T>` and `HttpRequestBuilder` return types ([#123]).
-   core: FRONTEND-3523 :: Bug :: Fix `HttpRequestBuilder.setResponseConstructor` for array generics ([#125]).

### Security

-   core: Upgrade dependencies.
-   core: BACKEND-1205 :: Feature Internal :: Update bcrypt cost factor ([#113]).

[#69]: https://github.com/mobilejazz/harmony-typescript/pull/69
[#72]: https://github.com/mobilejazz/harmony-typescript/pull/72
[#73]: https://github.com/mobilejazz/harmony-typescript/pull/73
[#75]: https://github.com/mobilejazz/harmony-typescript/pull/75
[#76]: https://github.com/mobilejazz/harmony-typescript/pull/76
[#97]: https://github.com/mobilejazz/harmony-typescript/pull/97
[#108]: https://github.com/mobilejazz/harmony-typescript/pull/108
[#111]: https://github.com/mobilejazz/harmony-typescript/pull/111
[#112]: https://github.com/mobilejazz/harmony-typescript/pull/112
[#113]: https://github.com/mobilejazz/harmony-typescript/pull/113
[#114]: https://github.com/mobilejazz/harmony-typescript/pull/114
[#115]: https://github.com/mobilejazz/harmony-typescript/pull/115
[#117]: https://github.com/mobilejazz/harmony-typescript/pull/117
[#119]: https://github.com/mobilejazz/harmony-typescript/pull/119
[#123]: https://github.com/mobilejazz/harmony-typescript/pull/123
[#125]: https://github.com/mobilejazz/harmony-typescript/pull/125

## [0.10.0] - 2021-09-16

### Security

-   core: Upgrade dependencies.

## [0.9.0] - 2020-08-04

### Added

-   bugfender: Add `@mobilejazz/harmony-bugfender` package.

### Changed

-   core: Clean-up project.

## [0.8.0-0.8.2] - 2021-04-07

### Added

-   angular: Add option to set FormData.
-   core: Implements cache operation fallback.

### Fixed

-   core: `UrlBuilder.prepareQueryParameters` handle falsy values.

### Security

-   core: Auditing all packages and removing all vulnerabilities.

## [0.7.0] - 2020-12-04

### Changed

-   core: New SQL Params paradigm (#49).

## [0.6.0-0.6.7] - 2020-12-03

### Added

-   core: Adding support for better sql params support.

### Changed

-   core: Update to Bugfender Web SDK 1.x
-   core: Allow empty SQLWhere Queries.

### Fixed

-   core: Fixing SQLRowCounter to support empty SQLWhere queries.

## [0.5.0-0.5.1] - 2020-07-15

### Added

-   core: Add linting.
-   core: Implementing soft delete and error codes.

## [0.4.1] - 2020-05-13

### Added

-   core: Add Bugfender logger

## [0.3.0-0.3.4] - 2020-04-08

### Added

-   core, nest: Support for PostgresSQL and MySQL.
-   core: Add test infrastructure.
-   nest: Adding token invalidation support.

### Changed

-   core: Use ES5 target instead of ES6 for maximum browser compatibility.
-   core: Removing offset limit limitation if where querery is not paginated.

### Deprecated

-   core: Add `deleteAll` deprecation notices.

### Security

-   core: Security fixes & `package-lock.json` update.

## [0.2.0] - 2020-01-10

### Added

-   core: Add `Logger` implementation.
-   core: Adding new Forbidden error.
-   core: Adding sql interface.
-   typeorm: Added the new typeorm sql interface.
-   core: Adding sql data source.
-   nest: Adding oauth sql script.

### Changed

-   core: Cleaning datasource and repository interfaces from ids.
-   core: Upgrading typescript to new datasource interface.
-   core: Modifying lerna scripts with canary option.
-   core: Improving constructors implementation.
-   nest: Moving crypto utils to harmony-nest.
-   core: Change library target compilation to ES2015 to have better browsers support.

### Security

-   core: Update dependencies.

## [0.1.0-0.1.3] - 2019-11-07

First release! 🥳

### Added

-   core: Base project structure.
-   core: Add JsonSerializer/Deserializer Mapper + Network/Storage Operations + Dictionary refactor + Core errors + Angular package.
-   typeorm: Added method that parse every condition expressed as array and add an `In` clause before
-   angular: Added Parameter Type including arrays.
-   core: Make Operation optional for `DeleteAll` and `PutAll` interactors.
-   core: Adding new features as `MockDataSource` or `VoidDataSource`.
-   core: Implementing in-memory data-source and cache repository.
-   core: Adding InvalidArgumentError.

### Changed

-   core: Change delete related return types to `void`.
-   core: Cache repository to throw `OperationNotSupportedError` instead of `MethodNotImplementedError`.
-   core: Improve constructors code.

### Fixed

-   angular: Fix `setUrlParameters` method.
-   core: Fix cache repository.
-   core: Fix cache issue on `getAll`.

[unreleased]: https://github.com/mobilejazz/harmony-typescript/compare/v0.12.0...HEAD
[0.12.0]: https://github.com/mobilejazz/harmony-typescript/compare/v0.11.2...v0.12.0
[0.11.0-0.11.2]: https://github.com/mobilejazz/harmony-typescript/compare/v0.10.0...v0.11.2
[0.10.0]: https://github.com/mobilejazz/harmony-typescript/compare/v0.9.0...v0.10.0
[0.9.0]: https://github.com/mobilejazz/harmony-typescript/compare/v0.8.2...v0.9.0
[0.8.0-0.8.2]: https://github.com/mobilejazz/harmony-typescript/compare/v0.7.0...v0.8.2
[0.7.0]: https://github.com/mobilejazz/harmony-typescript/compare/v0.6.7...v0.7.0
[0.6.0-0.6.7]: https://github.com/mobilejazz/harmony-typescript/compare/v0.5.1...v0.6.7
[0.5.0-0.5.1]: https://github.com/mobilejazz/harmony-typescript/compare/v0.4.1...v0.5.1
[0.4.1]: https://github.com/mobilejazz/harmony-typescript/compare/v0.3.4...v0.4.1
[0.3.0-0.3.4]: https://github.com/mobilejazz/harmony-typescript/compare/v0.2.0...v0.3.4
[0.2.0]: https://github.com/mobilejazz/harmony-typescript/compare/v0.1.3...v0.2.0
[0.1.0-0.1.3]: https://github.com/mobilejazz/harmony-typescript/compare/3c0f84a...v0.1.3
