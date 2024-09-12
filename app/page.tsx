/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/aria-proptypes */
/* eslint-disable jsx-a11y/role-supports-aria-props */
'use client';

import React, { useState, useEffect, useRef, SetStateAction, PointerEvent } from 'react';
import Image from "next/image";
import backgroundImage from '@/app/assets/background.jpg';
import windowsButton from '@/app/assets/menu-button.png';
import { sendMessageToOpenAI, generateImage } from '@/app/lib/openai';
import { TextWithLineBreaks } from '@/app/utils/TextWithLineBreaks';

type Coordinates = { x: number, y: number } | null;

const initialPosition = {
  x: 0,
  y: 0
};

export default function App() {
  const [position, setPosition] = useState<Coordinates>(initialPosition);
  const [lastCoordinates, setLastCoordinates] = useState<Coordinates>(null);
  const [input, setInput] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [type, setType] = useState<string>('text');
  const [textMessages, setTextMessages] = useState<string[]>([]);
  const [imageMessages, setImageMessages] = useState<string[]>([]);
  const textMessagesLengthRef = useRef<number>(0);
  const imageMessagesLengthRef = useRef<number>(0);

  useEffect(() => {
    scrollToLastMessage();
  }, [textMessages, imageMessages]);

  function handleMove(dx: number, dy: number) {
    setPosition({
      x: position!.x + dx,
      y: position!.y + dy
    });
  }

  function handlePointerDown(e: PointerEvent) {
    const target = (e.target as HTMLDivElement);
    target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e: PointerEvent) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      handleMove(dx, dy);
    }
  }

  function handlePointerUp(e: PointerEvent) {
    setLastCoordinates(null);
  }

  function handleChange(value: SetStateAction<string>) {
    setInput(value);
  }
  
  async function handleSendInput() {
    if(input === '') return;
    setTextMessages(prevState => [ ...prevState, input ]);
    textMessagesLengthRef.current += 1;
    setInput('');
    setIsDisabled(prevState => !prevState);
    const res = await sendMessageToOpenAI(input);
    // resObj = { answer: Chat GPT answer }
    const resObj = JSON.parse(res!);
    if(res !== null) {
      setTextMessages(prevState => [ ...prevState, resObj.answer ]);
      textMessagesLengthRef.current += 1;
    }
    setIsDisabled(prevState => !prevState);
  }

  async function handleSendInputImage() {
    if(input === '') return;
    setImageMessages(prevState => [ ...prevState, input ]);
    imageMessagesLengthRef.current += 1;
    setInput('');
    setIsDisabled(prevState => !prevState);
    const res : any = await generateImage(input);
    // res = generated image url
    if(res !== null) {
      setImageMessages(prevState => [ ...prevState, res ]);
      imageMessagesLengthRef.current += 1;
    }
    setIsDisabled(prevState => !prevState);
  }


  function handleKeyDown(key: string) {
    if(key === 'Enter') {
      switch(type) {
        case 'text':
          handleSendInput();
          break;
        case 'image':
          handleSendInputImage();
          break;
        default:
          break;
      }
    }
  }

  function handleClick() {
    switch(type) {
      case 'text':
        handleSendInput();
        break;
      case 'image':
        handleSendInputImage();
        break;
      default:
        break;
    }
  }

  function scrollToLastMessage() {
    switch(type) {
      case 'text':
        if(textMessagesLengthRef.current === 0) return;
        document.getElementById(String(textMessagesLengthRef.current - 1))!.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        })
        break;
      case 'image':
        if(imageMessagesLengthRef.current === 0) return;
        document.getElementById(String(imageMessagesLengthRef.current - 1))!.scrollIntoView({
          behavior: 'smooth',
          block: 'end'
        })
        break;
      default:
        break;
    }
  }

  const handleChangeType = (newType: string) => {
    setType(newType);
  }

  return (
    <main className="h-screen">
      <Image src={backgroundImage} alt="Windows XP background image" className="h-screen"></Image>
        <div style={{ transform: `translate(${position!.x}px, ${position!.y}px)` }} className="fixed max-lg:top-[3%] max-lg:left-[5%] max-lg:h-[90%] max-lg:w-[90%] lg:top-[15%] lg:left-[20%] lg:h-[60%] lg:w-[60%] shadow-[11px_15px_30px_-5px_rgba(0,0,0,0.75)]">
          <div className="window h-full w-full">
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="title-bar !h-[30px]">
                <div className="title-bar-text">Chat GPT</div>
                <div className="title-bar-controls">
                  <button aria-label="Minimize"></button>
                  <button aria-label="Maximize"></button>
                  <button aria-label="Close"></button>
                </div>
            </div>
            <div className="flex flex-col window-body !h-[calc(100%-45px)] ">
              <menu role="tablist">
                <button aria-selected={`${type === 'text' && "true"}`} className={`${type === 'image' && "mb-[0.9px] xl:mb-[1px]"}`} onClick={() => handleChangeType('text')}>Text</button>
                <button aria-selected={`${type === 'image' && "true"}`} className={`${type === 'text' && "mb-[0.9px] xl:mb-[1px]"}`} onClick={() => handleChangeType('image')}>Image</button>
              </menu>
              <div className="h-[calc(100%-50px)] w-full window-background border mb-1 border-[#919b9c] border-solid">
                <div className="mt-1 h-[calc(100%-8px)] w-full overflow-y-scroll">
                  <ul className="grid w-full self-start">
                    { type === 'text' ?
                      <>
                        { textMessages.length > 0 &&
                          <>
                          {textMessages.map((message, i) => 
                            <li id={String(i)} key={i} className="bg-gray-700 text-white rounded-sm w-fit max-lg:max-w-60 lg:max-w-xl h-fit p-3 m-2 odd:justify-self-end even:justify-self-start even:bg-azul-chat">
                              <TextWithLineBreaks text={message} />
                            </li>
                          )}
                          { isDisabled && <progress className="justify-self-center m-2" max="100"></progress> }
                          </>
                        }
                      </>
                      :
                      <>
                        { imageMessages.length > 0 &&
                          <>
                          {imageMessages.map((message, i) => 
                            <li id={String(i)} key={i} className="bg-gray-700 text-white rounded-sm w-fit max-lg:max-w-60 lg:max-w-xl h-fit p-3 m-2 odd:justify-self-end even:justify-self-start even:bg-azul-chat even:pb-0">
                              <TextWithLineBreaks text={message} />
                            </li>
                          )}
                          { isDisabled && <progress className="justify-self-center m-2" max="100"></progress> }
                          </>
                        }
                      </>
                    }
                  </ul>
                </div>
              </div>
              <div className="flex justify-end mx-1 mt-[2px]">
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
