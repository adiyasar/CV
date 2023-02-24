import Link from 'next/link';
import React from 'react';

export default function DropdownProfile(props) {
  let { href, children, ...rest } = props;
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
