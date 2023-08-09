-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "date_written" BIGINT NOT NULL,
    "asker_name" TEXT NOT NULL,
    "asker_email" TEXT NOT NULL,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "helpful" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answers" (
    "id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    "date_written" BIGINT NOT NULL,
    "answerer_name" TEXT NOT NULL,
    "answerer_email" TEXT NOT NULL,
    "reported" BOOLEAN NOT NULL DEFAULT false,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "questionsId" INTEGER,

    CONSTRAINT "Answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photos" (
    "id" SERIAL NOT NULL,
    "answer_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Questions_id_key" ON "Questions"("id");

-- CreateIndex
CREATE INDEX "Questions_helpful_product_id_idx" ON "Questions"("helpful", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Answers_id_key" ON "Answers"("id");

-- CreateIndex
CREATE INDEX "Answers_helpful_question_id_idx" ON "Answers"("helpful", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "Photos_id_key" ON "Photos"("id");

-- CreateIndex
CREATE INDEX "Photos_answer_id_idx" ON "Photos"("answer_id");

-- AddForeignKey
ALTER TABLE "Answers" ADD CONSTRAINT "Answers_questionsId_fkey" FOREIGN KEY ("questionsId") REFERENCES "Questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Photos" ADD CONSTRAINT "Photos_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "Answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
