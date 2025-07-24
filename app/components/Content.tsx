import Image from 'next/image';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import Link from 'next/link';
import {
  ContentChildrenProps,
  ContentProps,
  ContentTypes,
} from '@/app/utils/schema/otherProps';

import type { JSX } from "react";

function ParagraphBuilder({
  item,
}: {
  item:
    | ContentChildrenProps
    | {
        text: string;
        type: string;
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strikethrough?: boolean;
      };
}) {
  const style = `${item.bold && 'font-extrabold'} ${item.italic && 'italic'} ${item.strikethrough && 'line-through'} ${item.underline && 'underline'}`;

  return item.bold ? (
    <strong className={style}>{item.text}</strong>
  ) : (
    <span className={style}>{item.text}</span>
  );
}

export default function Content({
  props,
}: {
  props: ContentProps;
}): JSX.Element {
  const { type, children, format, level, image } = props;
  if (type == ContentTypes.paragraph) {
    return (
      <p>
        {children.map((e, index) => {
          if (e.type == 'link' && e.url)
            return (
              <Link key={index} className="text-yellow-800" href={e.url}>
                {e.children?.map((t, index) => (
                  <ParagraphBuilder key={index} item={t} />
                ))}
              </Link>
            );
          else return <ParagraphBuilder key={index} item={e} />;
        })}
      </p>
    );
  } else if (type == ContentTypes.heading)
    switch (level) {
      case 1:
        return (
          <h1>
            {children.map((item, index) => (
              <ParagraphBuilder key={index} item={item} />
            ))}
          </h1>
        );
      case 2:
        return (
          <h2>
            {children.map((item, index) => (
              <ParagraphBuilder key={index} item={item} />
            ))}
          </h2>
        );
      case 3:
        return (
          <h3>
            {children.map((item, index) => (
              <ParagraphBuilder key={index} item={item} />
            ))}
          </h3>
        );
      case 4:
        return (
          <h4>
            {children.map((item, index) => (
              <ParagraphBuilder key={index} item={item} />
            ))}
          </h4>
        );
      case 5:
        return (
          <h5>
            {children.map((item, index) => (
              <ParagraphBuilder key={index} item={item} />
            ))}
          </h5>
        );
      default:
        return (
          <h6>
            {children.map((item, index) => (
              <ParagraphBuilder key={index} item={item} />
            ))}
          </h6>
        );
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
              e.children &&
              e.children?.length > 0 && (
                <li key={index}>
                  {e.children!.map((item, index) => (
                    <ParagraphBuilder key={index} item={item} />
                  ))}
                </li>
              )
          )}
        </ul>
      );
    else
      return (
        <ol className="list-decimal list-inside">
          {children.map(
            (e, index) =>
              e.children &&
              e.children?.length > 0 && (
                <li key={index}>
                  {e.children!.map((item, index) => (
                    <ParagraphBuilder key={index} item={item} />
                  ))}
                </li>
              )
          )}
        </ol>
      );
  else if (type == ContentTypes.quote) {
    return (
      <div className="flex w-fit items-center">
        <FaQuoteRight />
        <p className="bg-gray-200 border-r-8 border-gray-500 px-1">
          {children.map((item, index) => (
            <ParagraphBuilder key={index} item={item} />
          ))}
        </p>
        <FaQuoteLeft />
      </div>
    );
  } else return <></>;
}
