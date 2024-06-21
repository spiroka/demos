interface Props {
  text: string;
  textToHighlight: string;
}

export function HighlightedText({ text, textToHighlight }: Props) {
  const regex = new RegExp(`^${textToHighlight}`, 'i');
  const textPart = text.replace(regex, '');

  return (
    <>
      {textPart === text ? text : (<><b>{textToHighlight}</b>{textPart}</>)}
    </>
  );
}
