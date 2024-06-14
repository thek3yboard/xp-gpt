'use client';

import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import backgroundImage from '@/app/assets/background.jpg';
import windowsButton from '@/app/assets/menu-button.png';
import minimizeButton from '@/app/assets/minimize-button.png';
import maximizeButton from '@/app/assets/maximize-button.png';
import closeButton from '@/app/assets/close-button.png';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const isClicked = useRef<boolean>(false);

  const coords = useRef<{
    startX: number,
    startY: number,
    lastX: number,
    lastY: number
  }>({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0
  })

  useEffect(() => {
    if (!boxRef.current || !containerRef.current) return;

    const box = boxRef.current;
    const container = containerRef.current;


    const onMouseDown = (e: MouseEvent) => {
      isClicked.current = true;
      coords.current.startX = e.clientX;
      coords.current.startY = e.clientY;
    }

    const onMouseUp = (e: MouseEvent) => {
      isClicked.current = false;
      coords.current.lastX = box.offsetLeft;
      coords.current.lastY = box.offsetTop;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isClicked.current) return;

      const nextX = e.clientX - coords.current.startX + coords.current.lastX;
      const nextY = e.clientY - coords.current.startY + coords.current.lastY;

      box.style.top = `${nextY}px`;
      box.style.left = `${nextX}px`;
    }

    box.addEventListener('mousedown', onMouseDown);
    box.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseUp);

    const cleanup = () => {
      box.removeEventListener('mousedown', onMouseDown);
      box.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseUp);
    }

    return cleanup;
  }, [])

  return (
    <div ref={containerRef} className="h-screen w-screen flex items-center justify-center overflow-hidden">
      <div ref={boxRef} className="w-24 h-24 bg-red-500 flex cursor-pointer"></div>
    </div>
  );
}

{/* <main className="h-screen">
      <Image src={backgroundImage} alt="Windows XP background image" className="h-screen"></Image>
        <div ref={containerRef} className="fixed rounded-t-lg top-[25%] left-[37%] h-[40%] w-[25%] shadow-[11px_15px_30px_-5px_rgba(0,0,0,0.75)]">
          <div ref={boxRef}className="h-full w-full rounded-t-lg bg-azul border-x border-y border-azul-oscuro">
            <div className="h-[7.5%] w-[100%] rounded-t-lg 
            bg-gradient-to-b from-0% from-azul via-10% via-celeste to-20% to-azul">
              <div className="flex justify-end items-center h-full w-full pr-[0.15rem] ">
                <Image src={minimizeButton} alt="Windows XP minimize button" className="flex h-[85%] w-[5%]"></Image>
                <Image src={maximizeButton} alt="Windows XP maximize button" className="flex h-[85%] w-[5%]"></Image>
                <Image src={closeButton} alt="Windows XP close button" className="flex h-[85%] w-[5%]"></Image>
              </div>
            </div>
            <div className="h-[91.3%] w-[98.8%] bg-zinc-300 ml-[0.5%] mb-[0.5%] border-t-2 border-b border-x border-azul-oscuro"></div>
          </div>
        </div>
        <footer className="w-full h-10 flex flex-row absolute bottom-0 left-0 bg-gradient-to-b from-0% from-azul via-10% via-celeste
        to-20% to-azul">
          <Image src={windowsButton} alt="Windows XP menu button"/>
        </footer>
    </main> */}