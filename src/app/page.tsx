export default function Home() {
  const colors = [
    'blue',
    'blue-light',
    'blue-pale',
    'yellow',
    'black',
    'black-nomad',
    'gray-50',
    'gray-100',
    'gray-200',
    'gray-300',
    'gray-400',
    'gray-500',
    'gray-600',
    'gray-700',
    'gray-800',
    'green',
    'green-dark',
    'green-light',
    'red',
    'red-light',
    'red-pale',
    'orange',
    'orange-pale',
  ];

  return (
    <main className="p-6 space-y-10">
      <h1 className="text-3xl font-bold mb-8">🎨 Tailwind @theme Color Test</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {colors.map((c) => {
          const v = `var(--color-${c})`;
          // 텍스트 대비를 위해 밝기 체크 후 흰색/검은색 결정(간단 버전)
          const textColor = [
            'gray-50',
            'gray-100',
            'blue-light',
            'blue-pale',
            'green-light',
            'red-light',
            'red-pale',
            'orange-pale',
          ].includes(c)
            ? '#000' // 밝은 배경이면 검은 글자
            : '#fff'; // 어두운 배경이면 흰 글자

          return (
            <div
              key={c}
              className="rounded-xl p-4 shadow-md flex flex-col items-center text-center"
              style={{ backgroundColor: v, color: textColor }}
            >
              <p className="font-semibold">{c}</p>
              <p className="mt-2">Text color changes</p>
              <svg
                className="w-10 h-10 mt-3"
                viewBox="0 0 24 24"
                style={{ fill: textColor }}
              >
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
          );
        })}
      </section>
    </main>
  );
}
