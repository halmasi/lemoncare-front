import Image from 'next/image';
import { ContentProps, ContentTypes } from '../utils/data/getPosts';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

export default function Content({ props }: { props: ContentProps }) {
  const { type, children, format, level, image, language } = props;
  if (type == ContentTypes.paragraph) {
    return <p>{children[0].text}</p>;
  } else if (type == ContentTypes.heading)
    switch (level) {
      case 1:
        return <h1>{children[0].text}</h1>;
      case 2:
        return <h2>{children[0].text}</h2>;
      case 3:
        return <h3>{children[0].text}</h3>;
      case 4:
        return <h4>{children[0].text}</h4>;
      case 5:
        return <h5>{children[0].text}</h5>;
      case 6:
        return <h6>{children[0].text}</h6>;
      default:
        break;
    }
  else if (type == ContentTypes.image && image) {
    return (
      <Image
        className="w-[80%] self-center rounded-2xl"
        src={image.url}
        alt={image.alternativeText || image.name}
        width={image.width}
        height={image.height}
      />
    );
  } else if (type == ContentTypes.list && format)
    if (format == 'unordered')
      return (
        <ul className="list-disc list-inside">
          {children.map(
            (e, index) =>
              e.children![0] && <li key={index}>{e.children![0].text}</li>
          )}
        </ul>
      );
    else
      return (
        <ol className="list-decimal list-inside">
          {children.map(
            (e, index) =>
              e.children![0] && <li key={index}>{e.children![0].text}</li>
          )}
        </ol>
      );
  else if (type == ContentTypes.quote) {
    return (
      <>
        {children.map((e, index) => (
          <p key={index} className="flex w-fit items-center">
            <FaQuoteRight />
            {e.text}
            <FaQuoteLeft />
          </p>
        ))}
      </>
    );
  }
}
