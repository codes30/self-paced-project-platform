"use server";

import prisma from "@/lib/prisma";
import _ from "lodash";
import { TSubmissionWithUserAndResults } from "../../types/submission";

export async function fetchAllSubmissionsByChallengeId({
  challengeId,
}: {
  challengeId: string;
}) {
  const data = await prisma.submission.findMany({
    where: { challenge: { id: challengeId } },
    include: { user: true, results: true },
  });
  if (_.isEmpty(data)) {
    return null;
  }

  const sortedSubmissions = sortSubmissionsByResults({ submissions: data });
  const uniqueSubmssions = getuniqueSubmissionsByUserId({
    submissions: sortedSubmissions,
  });

  return { submissions: uniqueSubmssions };
}

function sortSubmissionsByResults({
  submissions,
}: {
  submissions: TSubmissionWithUserAndResults[];
}) {
  const sortedSubmissions = _.orderBy(
    submissions,
    [
      // sort by number of passed results in desc
      (submission) => _.filter(submission.results, { status: "passed" }).length,
      // sort by execution time in asc
      (submission) => submission.executionTime,
    ],
    ["desc", "asc"], // Sorting order: passed results desc, execution time asc
  );
  return sortedSubmissions;
}

function getuniqueSubmissionsByUserId({
  submissions,
}: {
  submissions: TSubmissionWithUserAndResults[];
}) {
  const uniqueSubmissions = _.uniqBy(submissions, (submission) =>
    _.get(submission, "user.userId"),
  );

  return uniqueSubmissions;
}
