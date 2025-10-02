import ProfileCard from '@/components/Profile/ProfileCard';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 mt-5">
      <div className="flex gap-6 min-h-screen">
        {/* 프로필 카드 */}
        <aside>
          <ProfileCard />
        </aside>

        {/* 각 작업한 페이지 렌더링 */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
