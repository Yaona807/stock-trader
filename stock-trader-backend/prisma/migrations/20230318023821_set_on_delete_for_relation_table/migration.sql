-- RedefineTables
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "total_assets_details_total_assets_id_fkey" FOREIGN KEY ("total_assets_id") REFERENCES "total_assets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_total_assets_details" ("acquisition_price", "created_at", "current_price", "id", "shares_held", "stock_code", "stock_name", "stock_type", "total_assets_id", "updated_at") SELECT "acquisition_price", "created_at", "current_price", "id", "shares_held", "stock_code", "stock_name", "stock_type", "total_assets_id", "updated_at" FROM "total_assets_details";
DROP TABLE "total_assets_details";
ALTER TABLE "new_total_assets_details" RENAME TO "total_assets_details";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
