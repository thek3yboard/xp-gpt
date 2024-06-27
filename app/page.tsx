'use client';

import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import Image from "next/image";
import backgroundImage from '@/app/assets/background.jpg';
import windowsButton from '@/app/assets/menu-button.png';
import { sendMessageToOpenAI } from '@/app/lib/openai';
import { TextWithLineBreaks } from '@/app/utils/TextWithLineBreaks';

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const messagesLengthRef = useRef<number>(0);

  useEffect(() => {
    scrollToLastMessage();
  }, [messages]);

  function handleChange(value: SetStateAction<string>) {
    setInput(value);
  }
  
  async function handleSendInput() {
    if(input === '') return;
    setMessages(prevState => [ ...prevState, input ]);
    messagesLengthRef.current += 1;
    setInput('');
    setIsDisabled(prevState => !prevState);
    const res = await sendMessageToOpenAI(input);
    // resObj = { answer: Chat GPT answer }
    const resObj = JSON.parse(res!);
    if(res !== null) {
      setMessages(prevState => [ ...prevState, resObj.answer ]);
      messagesLengthRef.current += 1;
    }
    setIsDisabled(prevState => !prevState);
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
        <div className="fixed max-lg:top-[3%] max-lg:left-[5%] max-lg:h-[90%] max-lg:w-[90%] lg:top-[15%] lg:left-[20%] lg:h-[60%] lg:w-[60%] shadow-[11px_15px_30px_-5px_rgba(0,0,0,0.75)]">
          <div className="window h-full w-full">
            <div className="title-bar !h-[30px]">
              <div className="title-bar-text">Chat GPT</div>
              <div className="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label="Maximize"></button>
                <button aria-label="Close"></button>
              </div>
            </div>
            <div className="flex flex-col window-body !h-[calc(100%-30px)] !ml-[3px] !mr-[3px] !mt-[0px] ">
              <div className="h-full w-full overflow-y-scroll">
                <ul className="grid w-full self-start">
                  { messages.length > 0 &&
                    messages.map((message, i) => 
                      <li id={String(i)} key={i} className="bg-gray-700 text-white rounded-sm w-fit max-lg:max-w-60 lg:max-w-xl h-fit p-3 m-2 odd:justify-self-end even:justify-self-start even:bg-azul-chat">
                        <TextWithLineBreaks text={message} />
                      </li>
                    )
                  }
                </ul>
              </div>
              <div className="flex justify-end mx-1 my-1">
                <input type="text" className="flex w-[90%]" value={input} onChange={(e) => handleChange(e.target.value)} onKeyDown={(e) => handleKeyDown(e.key)} />
                <button className="inline-flex w-[10%] ml-1 items-center justify-center" disabled={isDisabled} onClick={handleClick}>Enviar</button>
              </div>
            </div>
          </div>
        </div>
        <footer className="w-full h-8 flex flex-row fixed bottom-0 left-0 bg-gradient-to-b from-0% from-azul via-10% via-celeste
        to-20% to-azul">
          <Image src={windowsButton} alt="Windows XP menu button"/>
        </footer>
    </main>
  );
}
