/*
 * PATH /src/project/resolve-package.ts
 */

import { AppError } from '../errors/AppError.js'
import { ErrorCodes } from '../errors/error-codes.js'
import type { ModuleDefinition } from '../modules/types.js'
import type { BaseProjectPackage } from './package.js'

export interface ResolvedProjectPackage extends BaseProjectPackage {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

/**
 * Ensures that a package is not declared in both runtime and development
 * dependencies.
 */
const validateCrossScopeDependencies = (
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>
): void => {
  for (const dependency of Object.keys(dependencies)) {
    if (dependency in devDependencies) {
      throw new AppError(
        `Dependency "${dependency}" is declared as both a dependency and a devDependency`,
        { code: ErrorCodes.DEPENDENCY_SCOPE_CONFLICT }
      )
    }
  }
}

/**
 * Merges module dependencies into the target dependency map.
 * Identical versions are deduplicated, while conflicting versions fail.
 */
const mergeDependencies = (
  target: Record<string, string>,
  incoming: Record<string, string> | undefined,
  source: string
): void => {
  if (!incoming) return

  for (const [dependency, version] of Object.entries(incoming)) {
    const existingVersion = target[dependency]

    if (existingVersion !== undefined && existingVersion !== version) {
      throw new AppError(
        `Dependency conflict for "${dependency}": "${existingVersion}" conflicts with "${version}" from "${source}"`,
        { code: ErrorCodes.DEPENDENCY_VERSION_CONFLICT }
      )
    }

    target[dependency] = version
  }
}

/**
 * Resolves the final project package by merging the base package with all
 * package contributions declared by the selected modules.
 */
export const resolveProjectPackage = (
  basePackage: BaseProjectPackage,
  modules: ModuleDefinition[]
): ResolvedProjectPackage => {
  const dependencies: Record<string, string> = {
    ...(basePackage.dependencies ?? {})
  }

  const devDependencies: Record<string, string> = {
    ...(basePackage.devDependencies ?? {})
  }

  for (const module of modules) {
    mergeDependencies(
      dependencies,
      module.package?.dependencies,
      module.meta.key
    )

    mergeDependencies(
      devDependencies,
      module.package?.devDependencies,
      module.meta.key
    )
  }

  validateCrossScopeDependencies(dependencies, devDependencies)

  return {
    ...basePackage,
    dependencies,
    devDependencies
  }
}