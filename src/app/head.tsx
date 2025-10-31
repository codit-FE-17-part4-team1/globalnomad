// app/head.tsx
export default function Head() {
  return (
    <>
      <title>GlobalNomad</title>
      <meta
        name="description"
        content="여행·체험 관련 일정 관리부터 예약까지 가능한 글로벌 여행 플랫폼입니다."
      />
      <meta name="author" content="코드잇_Part4_1팀" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <link rel="icon" href="/images/design_2/earth.png" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="GlobalNomad" />
      <meta
        property="og:description"
        content="여행·체험 관련 일정 관리부터 예약까지 가능한 글로벌 여행 플랫폼입니다."
      />
      <meta property="og:image" content="/images/og-image.png" />
      <meta property="og:url" content="https://example.com" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="GlobalNomad" />
      <meta
        name="twitter:description"
        content="여행·체험 관련 일정 관리부터 예약까지 가능한 글로벌 여행 플랫폼입니다."
      />
      <meta name="twitter:image" content="/images/og-image.png" />
    </>
  );
}
