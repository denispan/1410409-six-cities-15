import type { RATING_STARS } from '../../const';
import {memo} from 'react';

export type StarTitle = keyof typeof RATING_STARS;
export type StarValue = (typeof RATING_STARS)[StarTitle]

interface RatingStar {
  starTitle: StarTitle;
  starValue: StarValue;
  isDisabled?: boolean;
}

function RatingStar_({starTitle, starValue, isDisabled}: RatingStar) {
  return (
    <>
      <input
        className="form__rating-input visually-hidden"
        name="rating"
        value={starValue}
        id={`${starValue}-stars`}
        type="radio"
        disabled={isDisabled}
      />
      <label
        htmlFor={`${starValue}-stars`}
        className="reviews__rating-label form__rating-label"
        title={starTitle}
      >
        <svg className="form__star-image" width="37" height="33">
          <use xlinkHref="#icon-star"></use>
        </svg>
      </label>
    </>
  );
}

const RatingStar = memo(RatingStar_);

export default RatingStar;
