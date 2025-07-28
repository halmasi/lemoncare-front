import Breadcrumbs from '@/app/components/Breadcrumbs';
import CommentSection from '@/app/components/CommentSection';
import Content from '@/app/components/Content';
import MainSection from '@/app/components/MainSection';
import MediaGallery from '@/app/components/MediaGallery';
import VarietySelector from '@/app/components/VarietySelector';
import config from '@/app/utils/config';
import { getProduct } from '@/app/utils/data/getProducts';
import { ProductProps } from '@/app/utils/schema/shopProps';
import { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { slug } = params;
  const fetchedData = await getProduct(slug);
  const productArray: ProductProps[] = fetchedData.res;
  if (!productArray || !productArray.length) return notFound();

  const product = productArray[0];
  const previousImages = (await parent).openGraph?.images || [];
  const tags =
    product.tags && product.tags.length > 0
      ? product.tags.map((item) => item.title).join('، ')
      : [''];
  return {
    title: product.seo.seoTitle + ' | lemiro - لمیرو',
    description: product.seo.seoDescription + '\n برچسب ها: ' + tags,
    authors: [
      {
        name: 'lemiro - لمیرو',
        url: config.siteUrl,
      },
    ],

    applicationName: 'lemiro - لمیرو',
    category: product.category.title + ' | lemiro - لمیرو',
    openGraph: {
      title: product.seo.seoTitle + ' | lemiro - لمیرو',
      description: product.seo.seoDescription,
      siteName: 'lemiro - لمیرو',
      images: [
        product.basicInfo.mainImage.formats.medium.url,
        ...previousImages,
      ],
    },
  };
}

export default async function product(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const fetchedData = await getProduct(slug);
  const productArray: ProductProps[] = fetchedData.res;
  if (!productArray || !productArray.length) return notFound();
  const product = productArray[0];

  return (
    <MainSection>
      <div className="w-full flex flex-col">
        <div>
          <Breadcrumbs product={product} />
          <h2>{product.basicInfo.title}</h2>
        </div>
        <div className="h-fit flex flex-col md:flex-row px-2">
          <div className="w-full md:w-1/2 text-center">
            <div className="flex flex-col overflow-hidden">
              <MediaGallery media={product.media} />
            </div>
          </div>
          <div className="flex flex-col w-full md:w-1/2 items-center ">
            <VarietySelector product={product} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 m-2">
          <p>
            برچسب ها
            <strong className="px-2 bg-accent-pink/50 text-foreground rounded-lg">
              #
            </strong>
            :
          </p>
          {product.tags.map((tag, index) => (
            <div className="flex" key={index}>
              <Link
                className="px-2 bg-accent-pink/50 hover:bg-accent-pink/70 transition-colors text-background rounded-lg"
                href={'/shop/tags/' + tag.slug}
              >
                <p className="drop-shadow-lg">{tag.title}</p>
              </Link>
              {product.tags.length > 1 && index + 1 < product.tags.length && (
                <p>،</p>
              )}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <div className="mt-5 p-2 md:mx-10 bg-slate-50 border rounded-lg">
            {/* <h3 className="text-accent-pink">توضیحات محصول:</h3> */}
            <div className=" border md:hidden" />
            {product.detailes.map((item, i) => (
              <Content key={i} props={item} />
            ))}
          </div>
          <CommentSection productId={product.documentId} />
        </div>
      </div>
    </MainSection>
  );
}
