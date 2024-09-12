import { Fragment } from 'react';
import Image from "next/image";

type Props = {
  text: string
}

export function TextWithLineBreaks(props: Props) {
  const textWithBreaks = props.text.split('\n').map((text, index) => (
    <>
    { props.text.includes('http') ?
      <Fragment key={index}>
        <Image src={props.text} alt="ChatGPT generated image" width={1024} height={1024} />
        <br />
      </Fragment>  
      :
      <Fragment key={index}>
        {text}
        <br />
      </Fragment>
    }
    </>
  ));

  return <>{textWithBreaks}</>;
}