/* eslint-disable no-undef */
import './Image.css'
export function Image({ imgLink, imgAlt, className='w-[50%] object-cover object-center' }) {
    return (
      imgLink &&
      <img
        src={import.meta.env.VITE_REACT_APP_SPACES_URL + imgLink}
        alt={imgAlt}
        className={`${className}  `}
      />
    )
  }