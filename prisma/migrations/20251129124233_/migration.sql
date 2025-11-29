/*
  Warnings:

  - The primary key for the `ActivityParticipant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UserInterest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivityParticipant" (
    "userId" TEXT NOT NULL,
    "activityId" INTEGER NOT NULL,
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',

    PRIMARY KEY ("userId", "activityId"),
    CONSTRAINT "ActivityParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ActivityParticipant_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ActivityParticipant" ("activityId", "joinedAt", "role", "userId") SELECT "activityId", "joinedAt", "role", "userId" FROM "ActivityParticipant";
DROP TABLE "ActivityParticipant";
ALTER TABLE "new_ActivityParticipant" RENAME TO "ActivityParticipant";
CREATE TABLE "new_Goal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Goal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Interest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Goal" ("categoryId", "createdAt", "description", "endDate", "id", "isActive", "startDate", "title", "updatedAt", "userId") SELECT "categoryId", "createdAt", "description", "endDate", "id", "isActive", "startDate", "title", "updatedAt", "userId" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "goalId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("createdAt", "dueDate", "goalId", "id", "status", "updatedAt", "userId") SELECT "createdAt", "dueDate", "goalId", "id", "status", "updatedAt", "userId" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE TABLE "new_TaskProof" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "taskId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "proofImage" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TaskProof_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TaskProof_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TaskProof" ("createdAt", "id", "proofImage", "taskId", "userId") SELECT "createdAt", "id", "proofImage", "taskId", "userId" FROM "TaskProof";
DROP TABLE "TaskProof";
ALTER TABLE "new_TaskProof" RENAME TO "TaskProof";
CREATE TABLE "new_UserInterest" (
    "userId" TEXT NOT NULL,
    "interestId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "interestId"),
    CONSTRAINT "UserInterest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserInterest" ("interestId", "userId") SELECT "interestId", "userId" FROM "UserInterest";
DROP TABLE "UserInterest";
ALTER TABLE "new_UserInterest" RENAME TO "UserInterest";
CREATE TABLE "new_account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "password" TEXT,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_account" ("accessToken", "accountId", "id", "password", "providerId", "refreshToken", "userId") SELECT "accessToken", "accountId", "id", "password", "providerId", "refreshToken", "userId" FROM "account";
DROP TABLE "account";
ALTER TABLE "new_account" RENAME TO "account";
CREATE INDEX "account_userId_idx" ON "account"("userId");
CREATE TABLE "new_session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_session" ("expiresAt", "id", "token", "userId") SELECT "expiresAt", "id", "token", "userId" FROM "session";
DROP TABLE "session";
ALTER TABLE "new_session" RENAME TO "session";
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");
CREATE INDEX "session_userId_idx" ON "session"("userId");
CREATE TABLE "new_user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "emailVerified" BOOLEAN,
    "streak" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_user" ("createdAt", "email", "emailVerified", "id", "image", "name", "streak", "updatedAt") SELECT "createdAt", "email", "emailVerified", "id", "image", "name", "streak", "updatedAt" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
