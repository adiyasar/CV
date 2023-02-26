import Link from 'next/link';
import React from 'react';

export default function DropdownProfile(props) {
  let { href, children, ...rest } = props;
  return (
    <Link className="link" href={href} {...rest}>
      {children}
    </Link>
  );
}
