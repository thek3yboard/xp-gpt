'use client';

import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import Image from "next/image";
import backgroundImage from '@/app/assets/background.jpg';
import windowsButton from '@/app/assets/menu-button.png';
import minimizeButton from '@/app/assets/minimize-button.png';
import maximizeButton from '@/app/assets/maximize-button.png';
import closeButton from '@/app/assets/close-button.png';
import { sendMessageToOpenAI } from '@/app/utils/openai';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<string[]>([]);
  const messagesLengthRef = useRef<number>(0);

  useEffect(() => {
    scrollToLastMessage();
  }, [messages]);

  function handleChange(value: SetStateAction<string>) {
    setInput(value);
  }
  
  async function handleSendInput() {
    setMessages(prevState => [ ...prevState, input ]);
    messagesLengthRef.current += 1;
    let res = await sendMessageToOpenAI(input);
    if(res !== null) {
      setMessages(prevState => [ ...prevState, res ]);
      messagesLengthRef.current += 1;
    }
    setInput('');
  }

  function handleKeyDown(key: string) {
    if(key === 'Enter') {
      handleSendInput();
    }
  }

  function handleClick() {
    handleSendInput();
  }

  function scrollToLastMessage() {
    if(messagesLengthRef.current === 0) return;
    document.getElementById(String(messagesLengthRef.current - 1))!.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }

  return (
    <main className="h-screen">
      <Image src={backgroundImage} alt="Windows XP background image" className="h-screen"></Image>
        <div className="fixed rounded-t-lg top-[25%] left-[37%] h-[40%] w-[25%] shadow-[11px_15px_30px_-5px_rgba(0,0,0,0.75)]">
          <div className="h-full w-full rounded-t-lg bg-azul border-x border-y border-azul-oscuro">
            <div className="h-[7.5%] w-[100%] rounded-t-lg 
            bg-gradient-to-b from-0% from-azul via-10% via-celeste to-20% to-azul">
              <div className="flex justify-end items-center h-full w-full pr-[0.15rem] ">
                <Image src={minimizeButton} alt="Windows XP minimize button" className="flex h-[85%] w-[5%]"></Image>
                <Image src={maximizeButton} alt="Windows XP maximize button" className="flex h-[85%] w-[5%]"></Image>
                <Image src={closeButton} alt="Windows XP close button" className="flex h-[85%] w-[5%]"></Image>
              </div>
            </div>
            <div className="flex flex-col justify-end items-center h-[91.3%] w-[98.8%] bg-zinc-300 ml-[0.5%] mb-[0.5%] border-t-2 border-b border-x border-azul-oscuro">
                <div className="grid h-full w-full overflow-y-scroll">
                  <ul className="grid gap-4 self-start">
                  { messages.length > 0 &&
                    messages.map((message, i) => 
                      <li id={String(i)} key={i} className="bg-gray-700 text-white rounded-md w-fit h-fit p-3 my-1 odd:justify-self-end mr-1 even:justify-self-start ml-1">
                        {message}
                      </li>
                    )
                  }

                  {/* <li className="self-start justify-self-end bg-gray-700 text-white rounded-md w-fit h-fit p-3 mr-1 my-1"></li>
                  <li className="self-start justify-self-start bg-gray-700 text-white rounded-md w-fit h-fit p-3 ml-1 my-1"></li>
                  <li className="self-start justify-self-end bg-gray-700 text-white rounded-md w-fit h-fit p-3 mr-1 my-1"></li>
                  <li className="self-start justify-self-start bg-gray-700 text-white rounded-md w-fit h-fit p-3 ml-1 my-1"></li>
                  <li className="self-start justify-self-end bg-gray-700 text-white rounded-md w-fit h-fit p-3 mr-1 my-1"></li>
                  <li className="self-start justify-self-start bg-gray-700 text-white rounded-md w-fit h-fit p-3 ml-1 my-1"></li>
                  <li className="self-start justify-self-end bg-gray-700 text-white rounded-md w-fit h-fit p-3 mr-1 my-1"></li>
                  <li className="self-start justify-self-start bg-gray-700 text-white rounded-md w-fit h-fit p-3 ml-1 my-1"></li>
                  <li className="self-start justify-self-end bg-gray-700 text-white rounded-md w-fit h-fit p-3 mr-1 my-1"></li>
                  <li className="self-start justify-self-start bg-gray-700 text-white rounded-md w-fit h-fit p-3 ml-1 my-1"></li>
                  <li className="self-start justify-self-end bg-gray-700 text-white rounded-md w-fit h-fit p-3 mr-1 my-1"></li> */}
                  </ul>
                </div>
              <div className="flex flex-row w-full justify-start mt-1">
                <input type="text" className="flex h-6 w-3/4 border border-teal-700 mx-1 mb-1 px-1 text-black" value={input} onChange={(e) => handleChange(e.target.value)} onKeyDown={(e) => handleKeyDown(e.key)} />
                <button type="button" className="flex h-6 w-1/4 mx-1 text-black text-center justify-center border-2 
                rounded-md border-teal-900 bg-gris-claro ring-inset ring-offset-blue-400 ring-2" onClick={handleClick}>Enviar</button>
              </div>
            </div>
          </div>
        </div>
        <footer className="w-full h-10 flex flex-row absolute bottom-0 left-0 bg-gradient-to-b from-0% from-azul via-10% via-celeste
        to-20% to-azul">
          <Image src={windowsButton} alt="Windows XP menu button"/>
        </footer>
    </main>
  );
}
