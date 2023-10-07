import React from "react";

function Image({ src, alt, loading, className }) {
  return (
    <picture>
      <img className={className} src={src} alt={alt} loading={loading} />
    </picture>
  );
}

export default Image;
