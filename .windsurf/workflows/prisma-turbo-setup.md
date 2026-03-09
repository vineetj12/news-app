---
description: How to initialize Prisma in a Turbo repo and export to apps folder
---

# Setting Up Prisma in a Turbo Monorepo

## Step 1: Install Prisma Dependencies

First, install Prisma CLI and client in your root package.json:

```bash
npm install -D prisma
npm install @prisma/client
```

## Step 2: Create Prisma Setup in Root Package

Create a `packages/prisma` directory for shared Prisma configuration:

```bash
mkdir -p packages/prisma
cd packages/prisma
```

Initialize Prisma in the packages directory:

```bash
npx prisma init
```

This will create:
- `packages/prisma/schema.prisma`
- `packages/prisma/.env`

## Step 3: Configure Prisma Schema

Edit `packages/prisma/schema.prisma`:

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/@prisma/client"
}

datasource db {
  provider = "postgresql" // or mysql, sqlite, etc.
  url      = env("DATABASE_URL")
}

// Add your models here
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

## Step 4: Set Up Package.json for Prisma Package

Create `packages/prisma/package.json`:

```json
{
  "name": "@repo/prisma",
  "version": "0.1.0",
  "private": true,
  "main": "./index.ts",
  "types": "./index.ts",
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0"
  }
}
```

## Step 5: Create Export File

Create `packages/prisma/index.ts`:

```typescript
export { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

// Singleton instance for better performance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Step 6: Update Root Package.json

Add the prisma package to your root package.json workspaces:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "db:generate": "turbo run db:generate",
    "db:push": "turbo run db:push",
    "db:studio": "turbo run db:studio",
    "db:migrate": "turbo run db:migrate",
    "db:reset": "turbo run db:reset"
  }
}
```

## Step 7: Configure Turbo

Update `turbo.json` to include Prisma tasks:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "db:generate": {
      "cache": false,
      "outputs": ["node_modules/.prisma/**"]
    },
    "db:push": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    }
  }
}
```

## Step 8: Use Prisma in Apps

In any app (e.g., `apps/web`), install the prisma package:

```bash
cd apps/web
npm install @repo/prisma
```

Then use it in your app:

```typescript
// apps/web/src/lib/db.ts
import { prisma } from '@repo/prisma';

export { prisma };

// Example usage
async function getUsers() {
  return await prisma.user.findMany();
}
```

## Step 9: Environment Variables

Create `.env` in root or use your preferred env management:

```env
# Database connection string
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

## Step 10: Generate Prisma Client

Run the generation command:

```bash
npm run db:generate
```

## Step 11: Database Operations

Common database operations:

```bash
# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Reset database
npm run db:reset
```

## Step 12: TypeScript Configuration

Ensure your `tsconfig.json` includes the packages:

```json
{
  "compilerOptions": {
    "paths": {
      "@repo/prisma": ["../../packages/prisma"]
    }
  }
}
```

## Best Practices

1. **Always run `npm run db:generate` after schema changes**
2. **Use environment variables for database credentials**
3. **Keep the Prisma client as a singleton for performance**
4. **Add database seeding scripts if needed**
5. **Use Prisma's type safety throughout your apps**

## Troubleshooting

- If Prisma client isn't found, run `npm run db:generate`
- For TypeScript errors, ensure paths are correctly configured
- Check that DATABASE_URL is properly set in your environment
