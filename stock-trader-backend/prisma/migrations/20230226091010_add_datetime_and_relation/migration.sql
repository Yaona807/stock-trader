-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_user" ("email", "id", "password") SELECT "email", "id", "password" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
CREATE TABLE "new_total_assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total_assets" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "total_assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_total_assets" ("id", "total_assets", "user_id") SELECT "id", "total_assets", "user_id" FROM "total_assets";
DROP TABLE "total_assets";
ALTER TABLE "new_total_assets" RENAME TO "total_assets";
CREATE TABLE "new_total_assets_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_assets_id" INTEGER NOT NULL,
    "stock_type" TEXT NOT NULL,
    "stock_code" TEXT,
    "stock_name" TEXT NOT NULL,
    "acquisition_price" INTEGER NOT NULL,
    "shares_held" INTEGER NOT NULL,
    "current_price" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "total_assets_details_total_assets_id_fkey" FOREIGN KEY ("total_assets_id") REFERENCES "total_assets" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_total_assets_details" ("acquisition_price", "current_price", "id", "shares_held", "stock_code", "stock_name", "stock_type", "total_assets_id") SELECT "acquisition_price", "current_price", "id", "shares_held", "stock_code", "stock_name", "stock_type", "total_assets_id" FROM "total_assets_details";
DROP TABLE "total_assets_details";
ALTER TABLE "new_total_assets_details" RENAME TO "total_assets_details";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
