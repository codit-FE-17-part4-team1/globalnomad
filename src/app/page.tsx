// src/app/page.tsx
import Chips from '../components/Chips';
export default function Home() {
  return (
    <main className="p-6">
      Ready 🙌
      <>
        <Chips variant="white">선택</Chips>
        <Chips variant="blue">선택</Chips>
        <Chips variant="gray">선택</Chips>
        <Chips variant="orange">선택</Chips>
      </>
    </main>
  );
}
