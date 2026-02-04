# Landing Page Extraction Plan

## Task 2a: @eclipse-theiacloud/common Package Dependency Strategy

### Current State Analysis

**Package Status:**
- ✅ Published to npm registry as `@eclipse-theiacloud/common`
- Latest stable: `1.1.2`
- Next (pre-release): `1.2.0-next.83c8f60`
- Landing page currently uses: `1.2.0-next` (from package.json)

**Current Dependencies in Common Package:**
- `axios`: ^1.6.1
- `uuid`: ^8.3.2
- `@types/uuid`: ^8.3.4

### Recommended Strategy: **Use Published npm Package**

**Rationale:**
1. Package is already published and maintained
2. Avoids code duplication and drift
3. Simplifies dependency management
4. Enables independent updates to common library
5. Standard approach for monorepo extractions

### Implementation Plan

#### Option A: Use Latest Stable (RECOMMENDED for production)

```json
{
  "dependencies": {
    "@eclipse-theiacloud/common": "^1.1.2"
  }
}
```

**Pros:**
- Stable, tested version
- Production-ready
- Predictable behavior

**Cons:**
- May not have latest features from 1.2.0-next

#### Option B: Pin to Next Version (for development/testing)

```json
{
  "dependencies": {
    "@eclipse-theiacloud/common": "1.2.0-next.83c8f60"
  }
}
```

**Pros:**
- Matches current development version
- Has latest features

**Cons:**
- Pre-release version (not stable)
- May have breaking changes

#### Option C: Use dist-tag Next (RECOMMENDED for active development)

```json
{
  "dependencies": {
    "@eclipse-theiacloud/common": "next"
  }
}
```

**Pros:**
- Always gets latest pre-release
- Matches original monorepo behavior
- Useful during active development

**Cons:**
- May break on updates
- Less predictable

### Final Recommendation

**For Initial Extraction:** Use Option A (`^1.1.2`)
- Most stable approach
- Ensures landing page works immediately
- Can upgrade to `next` later if needed

**After Verification:** Can switch to Option C (`next`) if the team wants to track pre-release versions

### Migration Steps

1. **In new repository's package.json:**
   ```json
   {
     "dependencies": {
       "@eclipse-theiacloud/common": "^1.1.2",
       "keycloak-js": "25.0.4",
       "react": "^18.2.0",
       "react-dom": "^18.2.0",
       "three": "^0.180.0",
       "vanta": "^0.5.24"
     }
   }
   ```

2. **Update imports:** Ensure all imports use the package name (not relative paths)
   - ✅ Most files already correct: `import { ... } from '@eclipse-theiacloud/common'`
   - ❌ Fix `SelectApp.tsx`: Change `'../../../common/src/config.ts'` to `'@eclipse-theiacloud/common'`

3. **No vendoring needed:** Package is actively maintained and publicly available

### Contingency Plan

If npm package becomes unavailable or needs customization:

**Vendoring Strategy:**
1. Copy `node/common/src/` to new repo as `vendor/common/`
2. Update package.json:
   ```json
   {
     "name": "theia-cloud-landing-page",
     "dependencies": {
       "axios": "^1.6.1",
       "uuid": "^8.3.2"
     },
     "devDependencies": {
       "@types/uuid": "^8.3.4"
     }
   }
   ```
3. Update all imports: `'@eclipse-theiacloud/common'` → `'../vendor/common/client'`
4. Add TypeScript path alias in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@eclipse-theiacloud/common": ["./vendor/common/client.ts"]
       }
     }
   }
   ```

**Only use vendoring if:**
- npm package is deprecated
- Need custom modifications
- Package becomes unmaintained

### Verification Checklist

- [ ] Confirm package installs: `npm install @eclipse-theiacloud/common`
- [ ] Verify TypeScript types are available
- [ ] Test imports in all files
- [ ] Run build to ensure no import errors
- [ ] Test runtime functionality (API calls, config loading)

---

## Summary

**Decision:** Use published npm package `@eclipse-theiacloud/common` version `^1.1.2`

**Risk:** Low - package is actively maintained, publicly available, and stable

**Alternative:** Vendoring (only if npm package becomes unavailable)

**Next Steps:** Proceed to task 2b (Design standalone package.json)

---

## Task 2b: Standalone package.json Design

### Current Monorepo Structure

**Parent package.json** (`node/package.json`):
- npm workspaces: `["common", "e2e-tests", "landing-page", "testing-page"]`
- Shared devDependencies: ESLint, TypeScript, Prettier configs
- Node engine requirement: `>=20.0.0`

**Landing page package.json** (`node/landing-page/package.json`):
- Name: `landing-page` (not scoped)
- Version: `0.1.0`
- Private: `true`
- Dependencies: Inherited from workspace + own dependencies

### Issues to Resolve

1. **Package name** not scoped for npm (currently just `landing-page`)
2. **Missing shared devDependencies** that are currently in parent package.json
3. **License field** present but may need updating for standalone repo
4. **Version** starts at 0.1.0 (may want to align with theia-cloud versioning)
5. **Private flag** set to true (appropriate for now)

### Proposed Standalone package.json

```json
{
  "name": "theia-cloud-landing-page",
  "version": "1.0.0",
  "description": "Landing page for Theia Cloud workspace management",
  "license": "EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ls1intum/theia-cloud-landing-page.git"
  },
  "homepage": "https://github.com/ls1intum/theia-cloud-landing-page#readme",
  "bugs": {
    "url": "https://github.com/ls1intum/theia-cloud-landing-page/issues"
  },
  "keywords": [
    "theia",
    "cloud",
    "kubernetes",
    "landing-page",
    "react",
    "vite"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\""
  },
  "dependencies": {
    "@eclipse-theiacloud/common": "^1.1.2",
    "keycloak-js": "25.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.180.0",
    "vanta": "^0.5.24"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.20.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-header": "^3.1.1",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-no-null": "^1.0.2",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-react": "^7.29.4",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "eslint-plugin-simple-import-sort": "^7.0.0",
    "prettier": "^2.6.2",
    "typescript": "^5.3.3",
    "vite": "^7.2.2"
  }
}
```

### Key Changes Explained

#### 1. Package Identity
- **Name**: `landing-page` → `theia-cloud-landing-page`
  - More descriptive and unique
  - Follows convention: `<project>-<component>`
  - Ready for potential npm publication later
  
- **Version**: `0.1.0` → `1.0.0`
  - Signals production-ready extraction
  - Can sync with theia-cloud versioning later if needed

#### 2. Metadata Added
- **description**: Clear purpose statement
- **repository**: Git URL (will be created)
- **homepage**: GitHub README link
- **bugs**: Issue tracker URL
- **keywords**: Improve discoverability

#### 3. Node Engine Constraint
- **engines.node**: `>=20.0.0` (inherited from parent)
- Ensures compatibility with original build environment

#### 4. Enhanced Scripts
Added utility scripts:
- **lint:fix**: Auto-fix ESLint issues
- **typecheck**: Type checking without build
- **format**: Auto-format code with Prettier
- **format:check**: Verify formatting in CI

#### 5. Dependencies Consolidated

**From workspace parent** → Now direct devDependencies:
- `@types/node`: Required for Node.js types
- `@typescript-eslint/*`: TypeScript linting
- `eslint`: Core linter
- `eslint-config-prettier`: Prettier integration
- `eslint-plugin-*`: All eslint plugins used
- `prettier`: Code formatter
- `typescript`: Compiler

**Already present** (no change):
- React ecosystem
- Vite tooling
- Keycloak, Three.js, Vanta

**Upgraded**:
- `@eclipse-theiacloud/common`: `1.2.0-next` → `^1.1.2` (stable)

### Migration Checklist

**Before extraction:**
- [ ] Verify all devDependencies versions match parent
- [ ] Check if any additional eslint plugins are transitively required
- [ ] Confirm TypeScript version compatibility

**During extraction:**
- [ ] Create package.json with standalone config
- [ ] Run `npm install` to verify all dependencies resolve
- [ ] Test all scripts (`dev`, `build`, `lint`, `typecheck`)

**After extraction:**
- [ ] Update version in sync with theia-cloud releases (optional)
- [ ] Consider publishing to npm if landing page becomes reusable (optional)
- [ ] Add CI/CD scripts if needed (e.g., `test`, `docker:build`)

### Alternative: Minimal Approach

If we want to minimize changes:

```json
{
  "name": "theia-cloud-landing-page",
  "version": "0.1.0",
  "license": "EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@eclipse-theiacloud/common": "^1.1.2",
    "keycloak-js": "25.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.180.0",
    "vanta": "^0.5.24"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.20.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-header": "^3.1.1",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-no-null": "^1.0.2",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-react": "^7.29.4",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "eslint-plugin-simple-import-sort": "^7.0.0",
    "prettier": "^2.6.2",
    "typescript": "^5.3.3",
    "vite": "^7.2.2"
  }
}
```

**Differences:**
- Keep version at `0.1.0`
- Skip metadata (repository, homepage, bugs, keywords)
- Skip additional npm scripts

**Pros:**
- Less change, lower risk
- Faster to implement

**Cons:**
- Less professional standalone repo
- Missing useful development scripts
- Less discoverable if published later

### Recommendation

**Use the full version** with metadata and enhanced scripts:
1. Makes the repo professional and complete
2. Adds minimal complexity (just metadata)
3. Enhanced scripts improve developer experience
4. Future-proof for potential npm publication

### Next Steps

Proceed to task 2c (Plan shared config migration)

---

## Task 2c: Shared Config Migration Plan

### Current Monorepo Config Structure

The landing page currently uses shared configs from `node/configs/`:

| File | Purpose | Used By |
|------|---------|---------|
| `base.eslintrc.json` | Core ESLint rules | `.eslintrc.cjs` extends it |
| `warnings.eslintrc.json` | Warning-level rules | `.eslintrc.cjs` extends it |
| `errors.eslintrc.json` | Error-level rules | `.eslintrc.cjs` extends it |
| `base.prettier.json` | Prettier formatting | (Implicitly via eslint-plugin-prettier) |
| `base.tsconfig.json` | Base TypeScript config | NOT used by landing page |
| `license-check-config.json` | License header checks | NOT used by landing page |

**Landing page specific configs:**
- `.eslintrc.cjs` - ESLint config that extends shared configs
- `tsconfig.json` - TypeScript config for source files
- `tsconfig.node.json` - TypeScript config for Vite config file
- **No `.prettierrc`** - Uses rules from base.prettier.json via ESLint

### Migration Strategy Options

#### Option A: Inline All Configs (RECOMMENDED)

**Rationale:** Landing page is small, configs are stable, inlining simplifies maintenance

**Steps:**
1. Merge all ESLint configs into a single `.eslintrc.json`
2. Copy `.prettierrc.json` to root
3. Keep existing `tsconfig.json` and `tsconfig.node.json` (already standalone)

**Pros:**
- No external dependencies
- Single source of truth per tool
- Easy to customize later
- Standard for standalone repos

**Cons:**
- Loses automatic updates from shared configs
- Slightly more verbose

#### Option B: Copy Configs Directory

**Steps:**
1. Copy entire `node/configs/` to new repo as `configs/`
2. Update `.eslintrc.cjs` to point to `./configs/` instead of `../configs/`

**Pros:**
- Maintains structure familiarity
- Could share configs across future projects

**Cons:**
- Includes unused configs (license-check, base.tsconfig)
- Adds unnecessary complexity for single package
- Hard to justify `configs/` folder for one app

#### Option C: Hybrid Approach

**Steps:**
1. Inline ESLint and Prettier configs
2. Keep ability to extract to separate npm package later

**Pros:**
- Best of both worlds

**Cons:**
- Overengineered for current need

### Recommended Approach: Option A (Inline)

#### 1. ESLint Config

**New `.eslintrc.json` (merge of base + warnings + errors + landing-page specific):**

```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": ".",
    "project": "./tsconfig.json",
    "sourceType": "module",
    "ecmaVersion": 11,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "@typescript-eslint",
    "header",
    "import",
    "no-null",
    "react",
    "react-hooks",
    "react-refresh",
    "simple-import-sort",
    "prettier"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "es2020": true
  },
  "ignorePatterns": ["dist", ".eslintrc.json", "vite.config.ts", "*.d.ts"],
  "rules": {
    // Import sorting
    "sort-imports": "off",
    "import/order": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    
    // React
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": ["warn", { "allowConstantExport": true }],
    
    // General
    "no-redeclare": "off",
    "no-inner-declarations": "off",
    
    // Best Practices - Errors
    "curly": "error",
    "eol-last": "error",
    "eqeqeq": ["error", "smart"],
    "guard-for-in": "error",
    "no-caller": "error",
    "no-eval": "error",
    "no-restricted-imports": ["error", "..", "../index", "../..", "../../index"],
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }],
    
    // Variables
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    
    // Stylistic - Errors
    "max-len": ["error", { "code": 180 }],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "no-underscore-dangle": "off",
    "quotes": "off",
    "space-before-function-paren": ["error", { "anonymous": "always", "named": "never", "asyncArrow": "always" }],
    "one-var": ["error", "never"],
    
    // ES6 - Errors
    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": ["error", "as-needed"],
    "no-var": "error",
    "prefer-const": ["error", { "destructuring": "all" }],
    
    // TypeScript - Errors
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "args": "none" }],
    "@typescript-eslint/quotes": ["error", "single", { "avoidEscape": true }],
    "@typescript-eslint/semi": ["error", "always"],
    
    // Warnings
    "brace-style": ["warn", "1tbs"],
    "comma-dangle": "warn",
    "indent": ["warn", 2, { "SwitchCase": 1 }],
    "no-invalid-this": "warn",
    "no-new-wrappers": "warn",
    "no-return-await": "warn",
    "no-shadow": ["warn", { "hoist": "all" }],
    "no-trailing-spaces": "warn",
    "no-void": "warn",
    "prefer-object-spread": "warn",
    "radix": "warn",
    "spaced-comment": ["warn", "always", { "exceptions": ["*", "+", "-", "/", "!"] }],
    "use-isnan": "warn",
    "@typescript-eslint/explicit-function-return-type": ["warn", { "allowExpressions": true }],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/type-annotation-spacing": "warn",
    
    // Import plugin
    "import/export": "off",
    "import/no-deprecated": "error",
    "import/no-unresolved": ["error", { "ignore": ["vscode"] }],
    
    // No-null plugin
    "no-null/no-null": "error"
  }
}
```

**Changes from original:**
- Merged all 3 ESLint config files
- Changed from `.cjs` to `.json` (cleaner, standard)
- Updated `tsconfigRootDir` to `.` (repo root)
- Kept all rules intact

#### 2. Prettier Config

**New `.prettierrc.json`:**

```json
{
  "$schema": "http://json.schemastore.org/prettierrc",
  "singleQuote": true,
  "jsxSingleQuote": true,
  "arrowParens": "avoid",
  "trailingComma": "none",
  "endOfLine": "lf",
  "printWidth": 140,
  "tabWidth": 4,
  "overrides": [
    {
      "files": ["*.json", "*.yml"],
      "options": {
        "printWidth": 100,
        "tabWidth": 2
      }
    }
  ]
}
```

**Changes:**
- Direct copy from `base.prettier.json`
- No modifications needed

#### 3. TypeScript Configs

**Keep existing files as-is:**

**`tsconfig.json`** (already standalone):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ES2020",
    "skipLibCheck": true,
    "noEmitOnError": false,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "noImplicitOverride": true,
    "noImplicitReturns": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**`tsconfig.node.json`** (already standalone):
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ES2020",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

**No changes needed** - these configs don't reference shared configs.

#### 4. Optional: EditorConfig

**Consider adding `.editorconfig`** for consistent editor settings:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{ts,tsx,js,jsx,json,css}]
indent_style = space

[*.{ts,tsx,js,jsx}]
indent_size = 2

[*.json]
indent_size = 2

[*.{yml,yaml}]
indent_size = 2
```

### Migration Checklist

**Files to create in new repo:**
- [ ] `.eslintrc.json` (merged config)
- [ ] `.prettierrc.json` (copy from base.prettier.json)
- [ ] `tsconfig.json` (copy from landing-page)
- [ ] `tsconfig.node.json` (copy from landing-page)
- [ ] `.editorconfig` (optional, new)

**Files NOT needed:**
- ❌ `.eslintrc.cjs` (replaced by .eslintrc.json)
- ❌ `node/configs/` directory (inlined)
- ❌ `base.tsconfig.json` (not used)
- ❌ `license-check-config.json` (not used)

**Verification steps:**
1. Run `npm run lint` - should pass with same results as monorepo
2. Run `npm run build` - TypeScript should compile without errors
3. Check Prettier formatting: `npx prettier --check "src/**/*.{ts,tsx}"`
4. Verify IDE integration (VSCode ESLint/Prettier plugins)

### Notes on Rule Changes

**No rule changes** - all rules from the monorepo are preserved:
- ✅ All error-level rules maintained
- ✅ All warning-level rules maintained
- ✅ TypeScript strict mode preserved
- ✅ React-specific rules preserved
- ✅ Import sorting (simple-import-sort) preserved
- ✅ No-null plugin preserved

**Only structural changes:**
- Merged 3 files → 1 file
- Changed file extension (.cjs → .json)
- Updated paths (../ → ./)

### Future Considerations

**If multiple projects need same configs:**
1. Extract to separate npm package: `@ls1intum/eslint-config`
2. Publish to npm or GitHub packages
3. Use in package.json: `"eslintConfig": { "extends": "@ls1intum/eslint-config/react" }`

**For now:** Inline is simpler and sufficient.

### Next Steps

Proceed to task 2d (Define Docker build strategy)

---

## Task 2d: Docker Build Strategy for Standalone Repo

### Current Monorepo Dockerfile Analysis

**Location:** `dockerfiles/landing-page/Dockerfile`

**Current structure:**
```dockerfile
# build stage
FROM node:20-alpine as build-stage
WORKDIR /app
COPY node/common/src ./common/src
COPY node/common/package.json node/common/tsconfig*.json ./common/
COPY node/configs ./configs/
COPY node/tsconfig.json node/package*.json ./
COPY node/landing-page/. ./landing-page/

RUN npm ci && \
  npm run build -w common && \
  npm run build -w landing-page && \
  chmod 644 /app/landing-page/dist/favicon.ico

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/landing-page/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Issues with Current Dockerfile

1. **Monorepo dependencies:**
   - Copies `node/common/src` - will use npm package instead
   - Copies `node/configs` - will be inlined in new repo
   - Copies `node/package.json` - workspace config not needed
   - Uses `npm ci` at workspace root - standalone doesn't need workspace
   - Uses `-w common` and `-w landing-page` - workspace-specific flags

2. **Path assumptions:**
   - Assumes `node/` directory structure
   - Dockerfile location separate from code (`dockerfiles/` vs `node/landing-page/`)

3. **Build steps:**
   - Builds `common` package first, then landing page
   - In standalone, no need to build common (it's an npm package)

### Standalone Docker Strategy

#### Option A: Root-Level Dockerfile (RECOMMENDED)

Place Dockerfile at repository root alongside `package.json`.

**New Dockerfile:**

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies (includes @eclipse-theiacloud/common from npm)
RUN npm ci --only=production=false

# Copy source code and configs
COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public

# Build the application
RUN npm run build

# Fix favicon permissions (if needed)
RUN chmod 644 /app/dist/favicon.ico || true

# Production stage
FROM nginx:stable-alpine AS production

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Run nginx
CMD ["nginx", "-g", "daemon off;"]
```

**Key changes:**
- ✅ No monorepo paths
- ✅ No workspace commands
- ✅ Fetches `@eclipse-theiacloud/common` from npm
- ✅ Simple, linear build process
- ✅ Standard for standalone React apps

**Pros:**
- Simple, standard location
- No path complexity
- Easy to find and maintain

**Cons:**
- None for this use case

#### Option B: Dockerfiles Directory

Keep Dockerfile in `dockerfiles/` or `docker/` subdirectory.

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code (note: paths relative to context root)
COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public

# Build
RUN npm run build && \
    chmod 644 /app/dist/favicon.ico || true

# Production stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build command:**
```bash
docker build -f dockerfiles/Dockerfile -t landing-page .
```

**Pros:**
- Keeps Dockerfile separate from source
- Can have multiple Dockerfiles (dev, prod, etc.)

**Cons:**
- Less conventional for single-app repos
- Requires `-f` flag in build commands

### Recommended Approach: Option A (Root-Level)

**Rationale:**
1. Standard for standalone applications
2. Simpler paths and commands
3. Matches industry conventions
4. GitHub Actions expects root-level Dockerfile by default

### Nginx Configuration (Optional Enhancement)

**Current:** Uses default nginx config

**Consideration:** Add custom nginx.conf for SPA routing

**New file:** `nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache index.html and config.js
    location ~* (index\.html|config\.js)$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/javascript application/xml+rss 
               application/json application/xml;
}
```

**Updated Dockerfile with custom nginx config:**

```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public

RUN npm run build && \
    chmod 644 /app/dist/favicon.ico || true

# Production stage
FROM nginx:stable-alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Benefits:**
- SPA routing works correctly (all routes serve index.html)
- Optimized caching (1 year for assets, no cache for config.js)
- Gzip compression for smaller transfers
- Config.js can be updated at runtime without rebuilding

### Build Optimization (Optional)

**Multi-platform builds:**

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ghcr.io/ls1intum/theia-cloud-landing-page:latest \
  --push \
  .
```

**Build caching:**

```bash
docker build \
  --cache-from ghcr.io/ls1intum/theia-cloud-landing-page:cache \
  --build-arg BUILDKIT_INLINE_CACHE=1 \
  -t ghcr.io/ls1intum/theia-cloud-landing-page:latest \
  .
```

### .dockerignore File

**Create `.dockerignore`** to exclude unnecessary files:

```
# Dependencies
node_modules
dist

# Development files
.git
.github
.vscode
*.log
npm-debug.log*

# Config files not needed in container
.eslintrc.json
.prettierrc.json
.editorconfig

# Documentation
README.md
*.md

# Tests (if added later)
tests
*.test.ts
*.spec.ts
```

**Benefits:**
- Faster builds (smaller context)
- Smaller image layers
- No sensitive files copied

### Verification Checklist

**Before committing:**
- [ ] Dockerfile builds successfully: `docker build -t test .`
- [ ] Container runs: `docker run -p 8080:80 test`
- [ ] Landing page loads at http://localhost:8080
- [ ] Config.js loads correctly
- [ ] Static assets serve properly
- [ ] SPA routing works (if nginx.conf added)
- [ ] Multi-arch build works: `docker buildx build --platform linux/amd64,linux/arm64 .`

### Migration Checklist

**Files to create:**
- [ ] `Dockerfile` (root level)
- [ ] `nginx.conf` (optional but recommended)
- [ ] `.dockerignore`

**Changes from original:**
| Original | New |
|----------|-----|
| Multi-stage build ✅ | Kept |
| Workspace commands (`-w`) | Removed (standard `npm run build`) |
| Copies `node/common/src` | Removed (uses npm package) |
| Copies `node/configs` | Removed (configs inlined) |
| Workspace `package.json` | Removed (standalone package.json) |
| Chmod favicon | Kept (with `|| true` for safety) |
| Node 20 alpine | Kept |
| Nginx stable alpine | Kept |

### Summary

**Decision:** Use root-level Dockerfile with optional custom nginx.conf

**Key improvements:**
1. No monorepo dependencies
2. Uses published `@eclipse-theiacloud/common` package
3. Standard structure for standalone repos
4. Enhanced nginx config for SPA + caching
5. Proper .dockerignore for faster builds

**Risk:** Low - simplified from original, follows best practices

### Next Steps

Proceed to task 2e (Document all files and changes needed)

---

## Task 2e: Complete File Manifest & Migration Checklist

### New Repository Information

**Repository:** `ls1intum/EduTheia-landing-page` (created by user)
**URL:** https://github.com/ls1intum/EduTheia-landing-page
**Access:** Ready for commits

### Final Directory Structure

```
EduTheia-landing-page/
├── .github/
│   └── workflows/
│       └── docker-build.yml          [NEW - CI/CD workflow]
├── src/
│   ├── components/                   [COPY - 20 files]
│   │   ├── AppLogo.tsx
│   │   ├── AppLogo.css
│   │   ├── ErrorComponent.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx + .css
│   │   ├── Imprint.tsx + .css
│   │   ├── Info.tsx
│   │   ├── LaunchApp.tsx
│   │   ├── Loading.tsx
│   │   ├── LoginButton.tsx
│   │   ├── Privacy.tsx + .css
│   │   ├── SelectApp.tsx             [COPY + FIX IMPORT BUG]
│   │   ├── Spinner.tsx + .css
│   │   ├── ThemeToggle.tsx + .css
│   │   └── VantaBackground.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── resources/
│   │   └── background-image.png
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── public/                           [COPY ALL - ~26 files]
│   ├── assets/logos/                 (8 logo PNGs)
│   ├── images/logos/                 (8 logo PNGs - duplicate)
│   ├── config.js
│   ├── favicon.ico
│   ├── logo.svg, logo.png, logo512.png
│   ├── manifest.json
│   └── robots.txt
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── package.json                      [NEW - standalone]
├── package-lock.json                 [GENERATE - npm install]
├── .eslintrc.json                    [NEW - merged config]
├── .prettierrc.json                  [NEW - from configs]
├── .editorconfig                     [NEW - optional]
├── .gitignore                        [ENHANCED - see below]
├── Dockerfile                        [NEW - standalone]
├── nginx.conf                        [NEW - SPA routing]
├── .dockerignore                     [NEW]
├── README.md                         [NEW - comprehensive]
├── LICENSE                           [COPY from root]
└── EXTRACTION.md                     [THIS DOCUMENT]
```

---

### Phase-by-Phase Migration

#### Phase 1: Clone Original Repo (Read-Only)

```bash
git clone https://github.com/ls1intum/theia-cloud.git /tmp/theia-cloud-source
cd /tmp/theia-cloud-source
```

**Purpose:** Read files from original (NO MODIFICATIONS TO ORIGINAL)

---

#### Phase 2: Initialize New Repository

```bash
git clone https://github.com/ls1intum/EduTheia-landing-page.git
cd EduTheia-landing-page
git checkout -b feature/initial-extraction
```

---

#### Phase 3: Copy Core Application Files

**Copy source code:**
```bash
cp -r /tmp/theia-cloud-source/node/landing-page/src ./
cp -r /tmp/theia-cloud-source/node/landing-page/public ./
cp /tmp/theia-cloud-source/node/landing-page/index.html ./
cp /tmp/theia-cloud-source/node/landing-page/vite.config.ts ./
cp /tmp/theia-cloud-source/node/landing-page/tsconfig.json ./
cp /tmp/theia-cloud-source/node/landing-page/tsconfig.node.json ./
cp /tmp/theia-cloud-source/node/landing-page/README.md ./README.original.md
```

**Copy license:**
```bash
cp /tmp/theia-cloud-source/LICENSE ./
```

---

#### Phase 4: Create Configuration Files

**1. .gitignore** (Enhanced version)
```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules

# Build outputs
dist
dist-ssr
*.local

# Environment
.env
.env.local
.env.*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
Thumbs.db

# Testing
coverage
.nyc_output

# Temporary
*.tmp
*.temp
```

**2. package.json**
```json
{
  "name": "edutheia-landing-page",
  "version": "1.0.0",
  "description": "Landing page for EduTheia Cloud workspace management",
  "license": "EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ls1intum/EduTheia-landing-page.git"
  },
  "homepage": "https://github.com/ls1intum/EduTheia-landing-page#readme",
  "bugs": {
    "url": "https://github.com/ls1intum/EduTheia-landing-page/issues"
  },
  "keywords": [
    "theia",
    "cloud",
    "kubernetes",
    "landing-page",
    "react",
    "vite",
    "education"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\""
  },
  "dependencies": {
    "@eclipse-theiacloud/common": "^1.1.2",
    "keycloak-js": "25.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "three": "^0.180.0",
    "vanta": "^0.5.24"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@typescript-eslint/eslint-plugin": "^6.18.1",
    "@typescript-eslint/parser": "^6.18.1",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.20.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-header": "^3.1.1",
    "eslint-plugin-import": "^2.26.0",
    "eslint-plugin-no-null": "^1.0.2",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-react": "^7.29.4",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "eslint-plugin-simple-import-sort": "^7.0.0",
    "prettier": "^2.6.2",
    "typescript": "^5.3.3",
    "vite": "^7.2.2"
  }
}
```

**3. .eslintrc.json** (Merged from base + warnings + errors)
```json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": ".",
    "project": "./tsconfig.json",
    "sourceType": "module",
    "ecmaVersion": 11,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "@typescript-eslint",
    "header",
    "import",
    "no-null",
    "react",
    "react-hooks",
    "react-refresh",
    "simple-import-sort",
    "prettier"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "es2020": true
  },
  "ignorePatterns": ["dist", ".eslintrc.json", "vite.config.ts", "*.d.ts"],
  "rules": {
    "sort-imports": "off",
    "import/order": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "no-redeclare": "off",
    "no-inner-declarations": "off",
    "curly": "error",
    "eol-last": "error",
    "eqeqeq": ["error", "smart"],
    "guard-for-in": "error",
    "no-caller": "error",
    "no-eval": "error",
    "no-restricted-imports": [
      "error",
      "..",
      "../index",
      "../..",
      "../../index"
    ],
    "no-sequences": "error",
    "no-throw-literal": "error",
    "no-unused-expressions": [
      "error",
      {
        "allowShortCircuit": true,
        "allowTernary": true
      }
    ],
    "no-unused-vars": "off",
    "no-use-before-define": "off",
    "max-len": [
      "error",
      {
        "code": 180
      }
    ],
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1
      }
    ],
    "no-underscore-dangle": "off",
    "quotes": "off",
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "never",
        "asyncArrow": "always"
      }
    ],
    "one-var": ["error", "never"],
    "arrow-body-style": ["error", "as-needed"],
    "arrow-parens": ["error", "as-needed"],
    "no-var": "error",
    "prefer-const": [
      "error",
      {
        "destructuring": "all"
      }
    ],
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "args": "none"
      }
    ],
    "@typescript-eslint/quotes": [
      "error",
      "single",
      {
        "avoidEscape": true
      }
    ],
    "@typescript-eslint/semi": ["error", "always"],
    "brace-style": ["warn", "1tbs"],
    "comma-dangle": "warn",
    "indent": [
      "warn",
      2,
      {
        "SwitchCase": 1
      }
    ],
    "no-invalid-this": "warn",
    "no-new-wrappers": "warn",
    "no-return-await": "warn",
    "no-shadow": [
      "warn",
      {
        "hoist": "all"
      }
    ],
    "no-trailing-spaces": "warn",
    "no-void": "warn",
    "prefer-object-spread": "warn",
    "radix": "warn",
    "spaced-comment": [
      "warn",
      "always",
      {
        "exceptions": ["*", "+", "-", "/", "!"]
      }
    ],
    "use-isnan": "warn",
    "@typescript-eslint/explicit-function-return-type": [
      "warn",
      {
        "allowExpressions": true
      }
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/type-annotation-spacing": "warn",
    "import/export": "off",
    "import/no-deprecated": "error",
    "import/no-unresolved": [
      "error",
      {
        "ignore": ["vscode"]
      }
    ],
    "no-null/no-null": "error"
  }
}
```

**4. .prettierrc.json**
```json
{
  "$schema": "http://json.schemastore.org/prettierrc",
  "singleQuote": true,
  "jsxSingleQuote": true,
  "arrowParens": "avoid",
  "trailingComma": "none",
  "endOfLine": "lf",
  "printWidth": 140,
  "tabWidth": 4,
  "overrides": [
    {
      "files": ["*.json", "*.yml"],
      "options": {
        "printWidth": 100,
        "tabWidth": 2
      }
    }
  ]
}
```

**5. .editorconfig**
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{ts,tsx,js,jsx,json,css}]
indent_style = space

[*.{ts,tsx,js,jsx}]
indent_size = 2

[*.json]
indent_size = 2

[*.{yml,yaml}]
indent_size = 2
```

---

#### Phase 5: Create Docker Files

**Dockerfile**
```dockerfile
# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code and configs
COPY tsconfig.json tsconfig.node.json vite.config.ts index.html ./
COPY src ./src
COPY public ./public

# Build application
RUN npm run build && \
    chmod 644 /app/dist/favicon.ico || true

# Production stage
FROM nginx:stable-alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Never cache index.html and config.js (can be updated at runtime)
    location ~* (index\.html|config\.js)$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/javascript 
               application/xml+rss application/json application/xml;
}
```

**.dockerignore**
```
node_modules
dist
.git
.github
.vscode
*.log
npm-debug.log*
.eslintrc.json
.prettierrc.json
.editorconfig
README.md
*.md
tests
*.test.ts
*.spec.ts
.env
.env.local
coverage
.DS_Store
```

---

#### Phase 6: Create CI/CD Workflow

**.github/workflows/docker-build.yml**
```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  determine-tag:
    runs-on: ubuntu-latest
    outputs:
      base_tag: ${{ steps.set-tag.outputs.base_tag }}
      sha_tag: ${{ steps.set-tag.outputs.sha_tag }}
      cache_tag: ${{ steps.set-tag.outputs.cache_tag }}
    steps:
      - name: Determine Docker tags
        id: set-tag
        run: |
          if [ "${{ github.event_name }}" = "pull_request" ]; then
            echo "base_tag=pr-${{ github.event.pull_request.number }}" >> $GITHUB_OUTPUT
            echo "sha_tag=pr-${{ github.event.pull_request.number }}-${{ github.sha }}" >> $GITHUB_OUTPUT
            echo "cache_tag=latest" >> $GITHUB_OUTPUT
          else
            echo "base_tag=latest" >> $GITHUB_OUTPUT
            echo "sha_tag=latest-${{ github.sha }}" >> $GITHUB_OUTPUT
            echo "cache_tag=latest" >> $GITHUB_OUTPUT
          fi

  build-and-push:
    needs: determine-tag
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          platforms: ${{ github.event_name != 'pull_request' && 'linux/amd64,linux/arm64' || 'linux/amd64' }}
          push: true
          tags: |
            ghcr.io/ls1intum/edutheia-landing-page:${{ needs.determine-tag.outputs.base_tag }}
            ghcr.io/ls1intum/edutheia-landing-page:${{ needs.determine-tag.outputs.sha_tag }}
          cache-from: type=registry,ref=ghcr.io/ls1intum/edutheia-landing-page:${{ needs.determine-tag.outputs.cache_tag }}
          cache-to: type=inline
```

---

#### Phase 7: Fix Import Bug

**CRITICAL FIX:** `src/components/SelectApp.tsx`

Find line ~1:
```typescript
import { AppDefinition } from '../../../common/src/config.ts';
```

Replace with:
```typescript
import { AppDefinition } from '@eclipse-theiacloud/common';
```

**Verification command:**
```bash
grep -r "from.*\.\./\.\./\.\./common" src/
# Expected output: EMPTY (no matches)
```

---

#### Phase 8: Install Dependencies

```bash
npm install
```

This generates `package-lock.json`.

---

#### Phase 9: Verification Tests

**1. Type Check:**
```bash
npm run typecheck
# Expected: No errors
```

**2. Lint:**
```bash
npm run lint
# Expected: 0 errors, 0 warnings
```

**3. Build:**
```bash
npm run build
# Expected: dist/ folder created, no errors
```

**4. Docker Build:**
```bash
docker build -t test-edutheia-landing .
# Expected: Success
```

**5. Docker Run:**
```bash
docker run -p 8080:80 test-edutheia-landing
# Visit http://localhost:8080
# Expected: Landing page loads
```

---

#### Phase 10: Create README.md

(See comprehensive README in previous task 2d section - adapt name to EduTheia)

Key changes:
- Repository name: `EduTheia-landing-page`
- Image name: `ghcr.io/ls1intum/edutheia-landing-page`
- All references to "Theia Cloud" → "EduTheia"

---

### Critical Success Criteria

Before marking extraction complete:

✅ **Build succeeds:** `npm run build` exits 0
✅ **Type check passes:** `npm run typecheck` exits 0
✅ **Lint passes:** `npm run lint` with 0 warnings
✅ **Docker builds:** `docker build` succeeds
✅ **Docker runs:** Container starts, serves page on port 80
✅ **Import bug fixed:** No `../../../common` imports found
✅ **CI/CD works:** GitHub Actions workflow runs successfully
✅ **Dependencies installed:** `@eclipse-theiacloud/common@^1.1.2` from npm

---

### Migration Constraints (CRITICAL)

**✅ ALLOWED:**
- ✅ Clone/read from `ls1intum/theia-cloud` (read-only)
- ✅ Create commits in `ls1intum/EduTheia-landing-page`
- ✅ Push to `ls1intum/EduTheia-landing-page`
- ✅ Create branches in `ls1intum/EduTheia-landing-page`
- ✅ Create pull requests in `ls1intum/EduTheia-landing-page`

**❌ FORBIDDEN:**
- ❌ NO write operations to `ls1intum/theia-cloud`
- ❌ NO commits to original repository
- ❌ NO file deletions in original repository
- ❌ NO pull requests to original repository
- ❌ NO modifications to original repository files

**Cleanup of original (tasks 10a-12) will happen LATER after verification.**

---

### File Count Summary

| Category | Count |
|----------|-------|
| Source files (src/) | 25 |
| Public assets | 26 |
| Root config files | 8 |
| Docker files | 3 |
| CI/CD files | 1 |
| Documentation | 3 |
| **Total** | **~66 files** |

---

## Planning Phase Complete ✅

**Next Actions:**
1. Mark task 2e complete
2. Delegate tasks 3-8d to subagent (Sisyphus-Junior)
3. Verify subagent's work
4. User confirms new repository works
5. Later: Clean up original repository (tasks 10a-12)

**Delegation Target:** Sisyphus-Junior with `git-master` skill
**Expected Duration:** 15-30 minutes for full extraction
**Risk Level:** Low (all decisions made, mechanical execution)

---
