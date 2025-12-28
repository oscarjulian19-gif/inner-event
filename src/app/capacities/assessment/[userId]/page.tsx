import AssessmentClient from './AssessmentClient';

export const dynamic = 'force-dynamic';

export default async function AssessmentPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  return <AssessmentClient userId={userId} />;
}
