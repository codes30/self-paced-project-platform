import { getNotionData } from "@/actions/fetchNotionData";
import { getChallengeById } from "@/actions/getChallengeById";
import { fetchAllSubmissionsByChallengeId } from "@/actions/submissions.action";
import { PlaygroundPage } from "@/app/components/playground/main";
import _ from "lodash";

export default async function Page({ params }: { params: { id: string } }) {
  const challenge = await getChallengeById({ id: params.id });
  if (_.isEmpty(challenge)) {
    return <div>Invalid challenge Id</div>;
  }
  const notionRecordMap = await getNotionData({
    pageId: challenge.notionDocPageId,
  });
  const submissionsList = await fetchAllSubmissionsByChallengeId({
    challengeId: challenge.id,
  });

  return (
    <PlaygroundPage
      submissionsList={submissionsList?.submissions}
      recordMap={notionRecordMap}
      challenge={challenge}
    ></PlaygroundPage>
  );
}
