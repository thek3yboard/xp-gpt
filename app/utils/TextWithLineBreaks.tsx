import { Fragment } from 'react';

type Props = {
    text: string
}

export function TextWithLineBreaks(props: Props) {
  const textWithBreaks = props.text.split('\n').map((text, index) => (
    <Fragment key={index}>
      {text}
      <br />
    </Fragment>
  ));

  return <>{textWithBreaks}</>;
}