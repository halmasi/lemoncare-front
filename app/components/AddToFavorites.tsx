import {
  BsBookmark,
  BsBookmarkFill,
  BsHeart,
  BsHeartFill,
} from 'react-icons/bs';
import { PostsProps } from '../utils/schema/blogProps';
import { ProductProps } from '../utils/schema/shopProps';
import { useDataStore } from '../utils/states/useUserdata';
import { useEffect, useState } from 'react';
import { updateFavorite } from '../utils/data/getUserInfo';

export default function AddToFavorites({
  product,
  post,
}: {
  product?: ProductProps;
  post?: PostsProps;
}) {
  const { user } = useDataStore();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (user?.favorite.documentId && post?.documentId) {
      const resp = updateFavorite(
        user.favorite.documentId,
        post.documentId,
        'posts'
      );
    }
    // if (user && product) {
    // const favoriteProduct = user.favorites.products.find(
    // (item) => item.documentId == product.documentId
    // );
    // if (favoriteProduct) {
    // setIsFavorite(true);
    // }
    // } else if (user && post) {
    // }
  }, [user, post, product]);
  if (product)
    return (
      <div>
        {user ? (
          <BsHeartFill className="text-accent-pink/80 hover:text-accent-pink transition-colors duration-200" />
        ) : (
          <BsHeart className="hover:text-red-600 transition-colors duration-200" />
        )}
      </div>
    );
  else if (post) {
    return (
      <div>
        {user ? (
          <BsBookmarkFill className="text-accent-pink/80 hover:text-accent-pink transition-colors duration-200" />
        ) : (
          <BsBookmark className="hover:text-red-600 transition-colors duration-200" />
        )}
      </div>
    );
  }
}
