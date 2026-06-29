# Changelog

## [0.6.0](https://github.com/AssilemSDN/moleculer-gen/compare/v0.5.0...v0.6.0) (2026-06-29)


### Features

* **init-project:** modularize docker services and fix service structure ([d719532](https://github.com/AssilemSDN/moleculer-gen/commit/d7195320b3e0c3e82e1801d1a31ff48ed03a3678))
* **init-project:** support optional projectNameSanitized and plugins in config ([a6ea537](https://github.com/AssilemSDN/moleculer-gen/commit/a6ea5373ef7253fec74338a1a6e02afe273855f4))
* **init-projet:** add Prometheus module ([5462ad3](https://github.com/AssilemSDN/moleculer-gen/commit/5462ad39f95a7d8673272797bf34b12bfd965cf2))
* **prometheus:** add functional Prometheus plugin option ([f18eca9](https://github.com/AssilemSDN/moleculer-gen/commit/f18eca94a4c1c05e6bbe5091b529b8e91dcd2cbb))
* **validate:** add generated project validate feature ([e9ccd06](https://github.com/AssilemSDN/moleculer-gen/commit/e9ccd0673597cf7a1e4ec16bb1733b9dbc81530b))
* **validate:** add generated project validate feature ([ce14117](https://github.com/AssilemSDN/moleculer-gen/commit/ce141171f97bbd40243f1634377e1eed87a62a94))


### Bug Fixes

* **add-service:** harden routes config loading and fix DELETE route param ([28e7850](https://github.com/AssilemSDN/moleculer-gen/commit/28e78507fdcd31a5e5597c39afa369aa8d6d9c67))
* **add-service:** render dynamic module templates ([0ff8ac9](https://github.com/AssilemSDN/moleculer-gen/commit/0ff8ac95725c5830fe80880cf7dc60b64e5cb665))
* **add-service:** write service to docker/services/ instead of docker-compose.yaml ([f1e71f3](https://github.com/AssilemSDN/moleculer-gen/commit/f1e71f3fc05cf667fc997178773a1f71cdf911ca))
* **cli:** info log level by default ([c8e57e6](https://github.com/AssilemSDN/moleculer-gen/commit/c8e57e6525975247a97282ccede6a23effd2a9e9))
* **cli:** read version dynamically from package.json and use preAction hook for logger ([902bbd2](https://github.com/AssilemSDN/moleculer-gen/commit/902bbd2f86dd322e3f21cbdab4a963580d30b016))
* **command-runner:** check result.data !== undefined ([7ffce54](https://github.com/AssilemSDN/moleculer-gen/commit/7ffce54710cc446598778c45112654f964590b4f))
* **docker:** expose api gateway without traefik ([14f8a67](https://github.com/AssilemSDN/moleculer-gen/commit/14f8a67a375217feda689050a992f65b6065d172))
* **docker:** omit null and empty array fields from generated service YAML ([f2430ba](https://github.com/AssilemSDN/moleculer-gen/commit/f2430baf0ce49e4e7dbcd3ab79449726f451308b))
* format (standard) ([64ebe2e](https://github.com/AssilemSDN/moleculer-gen/commit/64ebe2e427e903b5956b703a1f7825ae5574980c))
* **generate-config:** correct .moleculer-gen dir name ([28428c7](https://github.com/AssilemSDN/moleculer-gen/commit/28428c77bed1df814b131adc1412867d2fe23aef))
* **generators:** sanitize path segments with path.basename ([480ba33](https://github.com/AssilemSDN/moleculer-gen/commit/480ba336393d271eaef1b981ba4ade65fbac9231))
* **init-project:** Fix dry-run option and default checked plugin option ([308901a](https://github.com/AssilemSDN/moleculer-gen/commit/308901a7803c0aa2dc9da43e262851c69832e9b1))
* **init-project:** fix prometheus docker-compose service generation ([ce99db9](https://github.com/AssilemSDN/moleculer-gen/commit/ce99db925ed7714bdf8d77e28151b122045a5b10))
* **init-project:** skip docker/config creation when prometheus is not selected ([7ae8122](https://github.com/AssilemSDN/moleculer-gen/commit/7ae81222ff37cf7a67adc1f87ff412f5799cf10d))
* **init-project:** validateConfig no longer mutates input and returns enriched config ([03c1d8f](https://github.com/AssilemSDN/moleculer-gen/commit/03c1d8f5478288818eb15fd274cde6e9fe29ef6c))
* **init:** render dynamic module templates ([c496d18](https://github.com/AssilemSDN/moleculer-gen/commit/c496d18e774b3c0222f4941dfd9e6a57792dff85))
* **routes:** fix api path ([6796921](https://github.com/AssilemSDN/moleculer-gen/commit/679692114319c1b7d7fde9b16f211ab9692ed2fd))
* **test:** correct init project test ([8e5d4f9](https://github.com/AssilemSDN/moleculer-gen/commit/8e5d4f9d85179320fad151986b7ac9893a27f934))

## [0.5.0](https://github.com/AssilemSDN/moleculer-gen/compare/v0.4.0...v0.5.0) (2025-10-28)


### Features

* add GitHub issue template ([f4c0b4b](https://github.com/AssilemSDN/moleculer-gen/commit/f4c0b4bf7f3e8626cc394040bc344545942f37dc))
* **add-service:** support JSON config file for non-interactive service creation ([8636173](https://github.com/AssilemSDN/moleculer-gen/commit/863617374591ca9869670d2950b36ceeb7b60fc5))


### Bug Fixes

* **add-service:** Fix prompt include for common-helpers ([63fb2ab](https://github.com/AssilemSDN/moleculer-gen/commit/63fb2ab4adf4ffeff389d4d019502c39ac9a26cd))
* **add-service:** no more data model creation if no crud service ([20b6670](https://github.com/AssilemSDN/moleculer-gen/commit/20b66705bc6fd461475f7b0880a37b3d3fc77e04))

## [0.4.0](https://github.com/AssilemSDN/moleculer-gen/compare/v0.3.0...v0.4.0) (2025-10-27)


### Features

* **templates:** convert README to Mustache template ([be7007f](https://github.com/AssilemSDN/moleculer-gen/commit/be7007f1850dd9e9a1be0edab191d994627d0125))


### Bug Fixes

* **init:** correct the use of modelName ([98e6787](https://github.com/AssilemSDN/moleculer-gen/commit/98e6787f382fc6fb9808c3127d81fc6840025c21))

## [0.3.0](https://github.com/AssilemSDN/moleculer-gen/compare/v0.2.0...v0.3.0) (2025-10-27)


### Features

* **add-service:** update Docker Compose and config.json ([c26e5b3](https://github.com/AssilemSDN/moleculer-gen/commit/c26e5b30afa07b7060f57ea47bb56da469355e75))
* **init:** add non-interactive JSON mode ([db1d4bb](https://github.com/AssilemSDN/moleculer-gen/commit/db1d4bb7dd5509dbfa7716e45f1e03523b77c394))
* introduce add-service command to add new service to an existing project ([2b19296](https://github.com/AssilemSDN/moleculer-gen/commit/2b192960dbf2683c98d3767d165d39a101f37aea))


### Bug Fixes

* **add-service:** fix default naming and mustache templates ([01fa033](https://github.com/AssilemSDN/moleculer-gen/commit/01fa0338e539f894633b778c727b032666784538))
* correct new service generation ([4304e05](https://github.com/AssilemSDN/moleculer-gen/commit/4304e0552fe50d6c56d6eca7298b7dc04d79e8a0))

## [0.2.0](https://github.com/AssilemSDN/moleculer-gen/compare/v0.1.0...v0.2.0) (2025-10-22)


### Features

* **init:** Include API gateway in project initialization ([9d613c0](https://github.com/AssilemSDN/moleculer-gen/commit/9d613c0b8343ab318a286b8cd6664a1a27797061))

## [0.1.0](https://github.com/AssilemSDN/moleculer-gen/compare/v0.0.1...v0.1.0) (2025-10-20)


### Features

* **cli:** add --dry-run option and flatten src structure ([64739d0](https://github.com/AssilemSDN/moleculer-gen/commit/64739d0538d7557dbc62bd3d97f48f5fd0e9350b))

## Changelog
