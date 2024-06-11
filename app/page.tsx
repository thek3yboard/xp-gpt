import Image from "next/image";
import backgroundImage from '@/app/assets/background.jpg';
import windowsButton from '@/app/assets/button.png';

export default function Home() {
  return (
    <main className="h-screen">
      <Image src={backgroundImage} alt="Windows XP background image" className="h-screen"/>
      <footer className="w-full h-10 flex flex-row absolute bottom-0 left-0 bg-gradient-to-b from-0% from-azul via-10% via-celeste
      to-20% to-azul">
        <Image src={windowsButton} alt="Windows XP button"/>
      </footer>
    </main>
  );
}
