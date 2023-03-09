-- CreateTable
CREATE TABLE "user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "total_assets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "total_assets" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "total_assets_details" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "total_assets_id" INTEGER NOT NULL,
    "stock_type" TEXT NOT NULL,
    "stock_code" TEXT,
    "stock_name" TEXT NOT NULL,
    "acquisition_price" INTEGER NOT NULL,
    "shares_held" INTEGER NOT NULL,
    "current_price" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "total_assets_details_total_assets_id_key" ON "total_assets_details"("total_assets_id");
